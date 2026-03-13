import { useEffect, useMemo, useState } from 'react';
import { createProduct, deleteProduct, listProducts, updateProduct } from './api';

const initialForm = {
  name: '',
  description: '',
  price: '',
  quantity: ''
};

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalItems = useMemo(
    () => products.reduce((acc, item) => acc + Number(item.quantity || 0), 0),
    [products]
  );

  async function refreshProducts() {
    setLoading(true);
    setError('');

    try {
      const data = await listProducts();
      setProducts(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshProducts();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity)
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      await refreshProducts();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function handleEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      quantity: String(product.quantity)
    });
  }

  async function handleDelete(id) {
    setError('');

    try {
      await deleteProduct(id);
      await refreshProducts();
      if (editingId === id) {
        resetForm();
      }
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <div className="page">
      <div className="glow glow-left" aria-hidden="true" />
      <div className="glow glow-right" aria-hidden="true" />

      <main className="dashboard">
        <header className="hero">
          <p className="tag">PLAY + REACT + MYSQL</p>
          <h1>Product Management</h1>
          <p className="subtitle">Desktop-first CRUD for creating, editing, and deleting products.</p>
        </header>

        <section className="stats">
          <article>
            <strong>{products.length}</strong>
            <span>Registered products</span>
          </article>
          <article>
            <strong>{totalItems}</strong>
            <span>Items in stock</span>
          </article>
        </section>

        {error ? <div className="alert">{error}</div> : null}

        <section className="content-grid">
          <form className="panel form-panel" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit product' : 'New product'}</h2>

            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Description
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
            </label>

            <div className="row">
              <label>
                Price
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Quantity
                <input
                  name="quantity"
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="actions">
              <button type="submit" className="primary">
                {editingId ? 'Update' : 'Save'}
              </button>
              {editingId ? (
                <button type="button" className="ghost" onClick={resetForm}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <section className="panel table-panel">
            <h2>Products</h2>
            {loading ? (
              <p>Loading...</p>
            ) : products.length === 0 ? (
              <p>No products registered.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          <small>{product.description || 'No description'}</small>
                        </td>
                        <td>R$ {Number(product.price).toFixed(2)}</td>
                        <td>{product.quantity}</td>
                        <td className="btn-group">
                          <button className="ghost" onClick={() => handleEdit(product)}>
                            Edit
                          </button>
                          <button className="danger" onClick={() => handleDelete(product.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default App;
