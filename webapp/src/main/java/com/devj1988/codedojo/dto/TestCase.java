package com.devj1988.codedojo.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestCase {
    String input;
    String output;
}
