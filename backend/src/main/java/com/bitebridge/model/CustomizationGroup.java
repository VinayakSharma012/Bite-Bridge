package com.bitebridge.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomizationGroup {
    private String name;
    private boolean required;
    private List<CustomizationOption> options;
}
