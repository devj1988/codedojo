package com.devj1988.codedojo.db.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document("problems")
@Data
public class Problem {
    @Id
    private String _id;

    private String title;
    private int number;
    private String level;
    private String description;
    private String shortName;
    private List<SolutionStub> solutionStubs;

    public Problem(String _id, int number, String level, String description, String shortName,
                   List<SolutionStub> solutionStubs) {
        super();
        this._id = _id;
        this.number = number;
        this.level = level;
        this.description = description;
        this.shortName = shortName;
        this.solutionStubs = solutionStubs;
    }

    @Data
    public static class SolutionStub {
        private String language;
        private String code;
    }
}
