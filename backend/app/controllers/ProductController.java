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
            return internalServerError(error("Failed to list products", exception));
        }
    }

    public Result getProduct(Long id) {
        try {
            Optional<Product> product = repository.findById(id);
            return product.map(value -> ok(Json.toJson(value)))
                    .orElseGet(() -> notFound(error("Product not found")));
        } catch (SQLException exception) {
            return internalServerError(error("Failed to get product", exception));
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
            return internalServerError(error("Failed to create product", exception));
        }
    }

    public Result updateProduct(Long id, Http.Request request) {
        try {
            Product product = parseAndValidate(request.body().asJson());
            Optional<Product> updated = repository.update(id, product);
            return updated.map(value -> ok(Json.toJson(value)))
                    .orElseGet(() -> notFound(error("Product not found")));
        } catch (IllegalArgumentException | IOException exception) {
            return badRequest(error(exception.getMessage()));
        } catch (SQLException exception) {
            return internalServerError(error("Failed to update product", exception));
        }
    }

    public Result deleteProduct(Long id) {
        try {
            boolean deleted = repository.delete(id);
            if (!deleted) {
                return notFound(error("Product not found"));
            }
            return noContent();
        } catch (SQLException exception) {
            return internalServerError(error("Failed to delete product", exception));
        }
    }

    private Product parseAndValidate(JsonNode body) throws IOException {
        if (body == null) {
            throw new IllegalArgumentException("JSON body is required");
        }

        Product product = objectMapper.treeToValue(body, Product.class);

        if (product.getName() == null || product.getName().isBlank()) {
            throw new IllegalArgumentException("Field 'name' is required");
        }

        if (product.getPrice() == null || product.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Field 'price' must be greater than or equal to zero");
        }

        if (product.getQuantity() == null || product.getQuantity() < 0) {
            throw new IllegalArgumentException("Field 'quantity' must be greater than or equal to zero");
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
