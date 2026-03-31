package com.bitebridge.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
            "/",
            "/{path:^(?!api$|actuator$|swagger-ui$|v3$|api-docs$|assets$)[^\\.]*}",
            "/{path:^(?!api$|actuator$|swagger-ui$|v3$|api-docs$|assets$)[^\\.]*}/{subpath:[^\\.]*}",
            "/{path:^(?!api$|actuator$|swagger-ui$|v3$|api-docs$|assets$)[^\\.]*}/{subpath:[^\\.]*}/{leaf:[^\\.]*}"
    })
    public String forwardToIndex() {
        return "forward:/index.html";
    }
}
