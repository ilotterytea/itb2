package kz.ilotterytea.huinya.api.repositories;

import io.micronaut.core.io.ResourceLoader;
import io.micronaut.logging.LoggingSystem;
import jakarta.inject.Singleton;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;
import java.util.Optional;

@Singleton
public class DocsRepository {
    private final ResourceLoader resourceLoader;
    private final Logger LOGGER = LoggerFactory.getLogger(DocsRepository.class.getName());

    public DocsRepository(ResourceLoader resourceLoader) {
        this.resourceLoader = resourceLoader;

    }

    public Optional<String> getFile(String fileName) {
        try {
            Optional<InputStream> inputStream = resourceLoader.getResourceAsStream("classpath:docs/" + fileName + ".md");

            if (inputStream.isPresent()) {
                byte[] data = inputStream.get().readAllBytes();
                String str = new String(data);

                return Optional.of(str);
            }
        } catch (IOException e) {
            LOGGER.error("Failed to read the file bytes!", e);
        }

        return Optional.empty();
    }
}
