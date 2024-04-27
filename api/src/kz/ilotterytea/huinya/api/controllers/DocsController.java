package kz.ilotterytea.huinya.api.controllers;

import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Get;
import jakarta.inject.Inject;
import kz.ilotterytea.huinya.api.Response;
import kz.ilotterytea.huinya.api.models.DocModel;
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
    public Response<DocModel> getDocs(String name) {
        Optional<String> contents = this.repository.getFile(name);

        if (contents.isEmpty()) {
            return new Response<>(404, "Doc " + name + " not exists!", null);
        }

        DocModel model = new DocModel(name, contents.get());

        return new Response<>(200, null, model);
    }

    @Get
    public Response<DocModel> getAvailableDocs() {
        return this.getDocs("summary");
    }
}
