package main

import (
    "context"
    "fmt"
    "log"
    "net/http"
    "time"

    "github.com/gin-contrib/cors"
    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/bson/primitive"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// Config
var mongoUri string = "mongodb://localhost:27017"
var mongoDbName string = "cps_app_db"
var mongoCollectionCourse string = "courses"

// Database variables
var mongoclient *mongo.Client
var courseCollection *mongo.Collection

// Course struct
type Course struct {
    Id           primitive.ObjectID `bson:"_id,omitempty" json:"id"`
    Name         string             `json:"name" bson:"name"`
    Duration     string             `json:"duration" bson:"duration"`
    Price        string             `json:"price" bson:"price"`
    Trainer_Name string             `json:"trainer_name" bson:"trainer_name"`
    Level        string             `json:"level" bson:"level"`
    Description  string             `json:"description" bson:"description"`
}

// Connect to MongoDB
func connectDB() {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    var err error
    mongoclient, err = mongo.Connect(ctx, options.Client().ApplyURI(mongoUri))
    if err != nil {
        log.Fatal("MongoDB Connection Error:", err)
    }

    courseCollection = mongoclient.Database(mongoDbName).Collection(mongoCollectionCourse)
    fmt.Println("Connected to MongoDB!")
}

// POST /courses
func createCourse(c *gin.Context) {
    var jbodyCourse Course

    // Bind JSON body to jbodyCourse
    if err := c.BindJSON(&jbodyCourse); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Insert course into MongoDB
    result, err := courseCollection.InsertOne(ctx, jbodyCourse)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create course"})
        return
    }

    jbodyCourse.Id = result.InsertedID.(primitive.ObjectID) // Convert ObjectID to string

    // Return created course
    c.JSON(http.StatusCreated, gin.H{
        "message": "Course created successfully",
        "course":  jbodyCourse,
    })
}

// GET /courses
func readAllCourses(c *gin.Context) {
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    cursor, err := courseCollection.Find(ctx, bson.M{})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
        return
    }
    defer cursor.Close(ctx)

    // Ensure courses is an empty slice, not nil
    courses := []Course{}
    if err := cursor.All(ctx, &courses); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse courses"})
        return
    }

    c.JSON(http.StatusOK, courses)
}

// GET /courses/:id
func readCourseById(c *gin.Context) {
    id := c.Param("id")

    // Convert string ID to primitive.ObjectID
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    var course Course
    err = courseCollection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&course)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
        return
    }

    c.JSON(http.StatusOK, course)
}

// PUT /courses/:id
func updateCourse(c *gin.Context) {
    id := c.Param("id")
    var jbodyCourse Course

    // Bind JSON body to jbodyCourse
    if err := c.BindJSON(&jbodyCourse); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Convert string ID to primitive.ObjectID
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Update course in MongoDB
    updateResult, err := courseCollection.UpdateOne(ctx, bson.M{"_id": objectID}, bson.M{"$set": jbodyCourse})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update course"})
        return
    }

    if updateResult.MatchedCount == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Course updated successfully", "course": jbodyCourse})
}

// DELETE /courses/:id
func deleteCourse(c *gin.Context) {
    id := c.Param("id")

    // Convert string ID to primitive.ObjectID
    objectID, err := primitive.ObjectIDFromHex(id)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
        return
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    // Delete course from MongoDB
    result, err := courseCollection.DeleteOne(ctx, bson.M{"_id": objectID})
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete course"})
        return
    }

    if result.DeletedCount == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "Course not found"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Course deleted successfully"})
}

func main() {
    // Connect to MongoDB
    connectDB()

    // Set up Gin router
    r := gin.Default()
    // CORS Configuration
    r.Use(cors.New(cors.Config{
        AllowAllOrigins: true,
        AllowMethods:    []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
        AllowHeaders:    []string{"*"},
        ExposeHeaders:   []string{"Content-Length"},
        AllowCredentials: true,
        MaxAge:           12 * time.Hour,
    }))

    // Routes
    r.POST("/courses", createCourse)
    r.GET("/courses", readAllCourses)
    r.GET("/courses/:id", readCourseById)
    r.PUT("/courses/:id", updateCourse)
    r.DELETE("/courses/:id", deleteCourse)
    r.Run()
}
