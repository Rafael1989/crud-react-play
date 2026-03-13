package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.inject.Inject;
import models.Product;
import models.ProductRepository;
import play.libs.Json;
import play.mvc.Controller;
import play.mvc.Http;
import play.mvc.Result;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public class ProductController extends Controller {

    private final ProductRepository repository;
    private final ObjectMapper objectMapper;

    @Inject
    public ProductController(ProductRepository repository) {
        this.repository = repository;
        this.objectMapper = Json.mapper();
    }

    public Result listProducts() {
        try {
            List<Product> products = repository.findAll();
            return ok(Json.toJson(products));
        } catch (SQLException exception) {
            return internalServerError(error("Erro ao listar produtos", exception));
        }
    }

    public Result getProduct(Long id) {
        try {
            Optional<Product> product = repository.findById(id);
            return product.map(value -> ok(Json.toJson(value)))
                    .orElseGet(() -> notFound(error("Produto nao encontrado")));
        } catch (SQLException exception) {
            return internalServerError(error("Erro ao buscar produto", exception));
        }
    }

    public Result createProduct(Http.Request request) {
        try {
            Product product = parseAndValidate(request.body().asJson());
            Product created = repository.create(product);
            return created(Json.toJson(created));
        } catch (IllegalArgumentException | IOException exception) {
            return badRequest(error(exception.getMessage()));
        } catch (SQLException exception) {
            return internalServerError(error("Erro ao criar produto", exception));
        }
    }

    public Result updateProduct(Long id, Http.Request request) {
        try {
            Product product = parseAndValidate(request.body().asJson());
            Optional<Product> updated = repository.update(id, product);
            return updated.map(value -> ok(Json.toJson(value)))
                    .orElseGet(() -> notFound(error("Produto nao encontrado")));
        } catch (IllegalArgumentException | IOException exception) {
            return badRequest(error(exception.getMessage()));
        } catch (SQLException exception) {
            return internalServerError(error("Erro ao atualizar produto", exception));
        }
    }

    public Result deleteProduct(Long id) {
        try {
            boolean deleted = repository.delete(id);
            if (!deleted) {
                return notFound(error("Produto nao encontrado"));
            }
            return noContent();
        } catch (SQLException exception) {
            return internalServerError(error("Erro ao remover produto", exception));
        }
    }

    private Product parseAndValidate(JsonNode body) throws IOException {
        if (body == null) {
            throw new IllegalArgumentException("Body JSON obrigatorio");
        }

        Product product = objectMapper.treeToValue(body, Product.class);

        if (product.getName() == null || product.getName().isBlank()) {
            throw new IllegalArgumentException("Campo 'name' obrigatorio");
        }

        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Campo 'price' deve ser maior ou igual a zero");
        }

        if (product.getQuantity() == null || product.getQuantity() < 0) {
            throw new IllegalArgumentException("Campo 'quantity' deve ser maior ou igual a zero");
        }

        return product;
    }

    private JsonNode error(String message) {
        return Json.newObject().put("error", message);
    }

    private JsonNode error(String message, Exception exception) {
        return Json.newObject().put("error", message).put("details", exception.getMessage());
    }
}
