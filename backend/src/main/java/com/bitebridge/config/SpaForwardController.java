package com.bitebridge.config;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;

@Controller
public class SpaForwardController {

    private static final Set<String> NON_SPA_ROOTS = Set.of("api", "actuator", "swagger-ui", "v3", "api-docs");

    @GetMapping(value = {
            "/",
            "/{path:[^\\.]*}",
            "/{path:[^\\.]*}/{*remaining}"
    })
    public String forwardToIndex(@PathVariable(name = "path", required = false) String path) {
        if (path != null && NON_SPA_ROOTS.contains(path)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }

        return "forward:/index.html";
    }
}
