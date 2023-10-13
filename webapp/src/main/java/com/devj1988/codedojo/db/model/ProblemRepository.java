package com.devj1988.codedojo.db.model;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
public interface ProblemRepository extends MongoRepository<Problem, String> {

    @Query("{ 'number' : ?0 }")
    Problem findProblemByNumber(int number);

//    @Query(value="{category:'?0'}", fields="{'name' : 1, 'quantity' : 1}")
//    List<GroceryItem> findAll(String category);

    public long count();

}