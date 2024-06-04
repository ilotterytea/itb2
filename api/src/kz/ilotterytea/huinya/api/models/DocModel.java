package kz.ilotterytea.huinya.api.models;

import io.micronaut.serde.annotation.Serdeable;

@Serdeable
public class DocModel {
    private final String name;
    private final String content;

    public DocModel(String name, String content) {
        this.name = name;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public String getContent() {
        return content;
    }
}
