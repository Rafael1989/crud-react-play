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
          <h1>Gestao de Produtos</h1>
          <p className="subtitle">CRUD desktop-first para cadastro, edicao e remocao de produtos.</p>
        </header>

        <section className="stats">
          <article>
            <strong>{products.length}</strong>
            <span>Produtos cadastrados</span>
          </article>
          <article>
            <strong>{totalItems}</strong>
            <span>Itens em estoque</span>
          </article>
        </section>

        {error ? <div className="alert">{error}</div> : null}

        <section className="content-grid">
          <form className="panel form-panel" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Editar produto' : 'Novo produto'}</h2>

            <label>
              Nome
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Descricao
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
            </label>

            <div className="row">
              <label>
                Preco
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
                Quantidade
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
                {editingId ? 'Atualizar' : 'Salvar'}
              </button>
              {editingId ? (
                <button type="button" className="ghost" onClick={resetForm}>
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>

          <section className="panel table-panel">
            <h2>Produtos</h2>
            {loading ? (
              <p>Carregando...</p>
            ) : products.length === 0 ? (
              <p>Nenhum produto cadastrado.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Preco</th>
                      <th>Qtd</th>
                      <th>Acoes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          <small>{product.description || 'Sem descricao'}</small>
                        </td>
                        <td>R$ {Number(product.price).toFixed(2)}</td>
                        <td>{product.quantity}</td>
                        <td className="btn-group">
                          <button className="ghost" onClick={() => handleEdit(product)}>
                            Editar
                          </button>
                          <button className="danger" onClick={() => handleDelete(product.id)}>
                            Excluir
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
