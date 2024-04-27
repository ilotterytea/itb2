package kz.ilotterytea.huinya.api.controllers;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import jakarta.inject.Inject;
import kz.ilotterytea.huinya.api.Response;
import kz.ilotterytea.huinya.api.repositories.DocsRepository;

import java.util.Optional;

@Controller("/v1/docs")
public class DocsController {
    private final DocsRepository repository;

    @Inject
    public DocsController(DocsRepository repository) {
        this.repository = repository;
    }

    @Get("/{name:.*}")
    public Response<String> getDocs(String name) {
        Optional<String> contents = this.repository.getFile(name);

        return contents.map(s -> new Response<>(200, null, s)).orElseGet(() -> new Response<>(404, "Docs " + name + " not found", null));
    }
}
