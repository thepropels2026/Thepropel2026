# Import the FastAPI framework for building APIs
from fastapi import FastAPI
# Import CORS middleware to handle Cross-Origin Resource Sharing
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic's BaseModel for structured data validation
from pydantic import BaseModel

# Initialize the FastAPI application with a custom title
app = FastAPI(title="The Propels API")

# Configure CORS middleware settings
app.add_middleware(
    CORSMiddleware,
    # Allow requests from all origins (useful for development/testing)
    allow_origins=["*"],
    # Allow sending credentials such as cookies or authorization headers
    allow_credentials=True,
    # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_methods=["*"],
    # Allow all HTTP headers in the request
    allow_headers=["*"],
)

# Define a data model for user profiles using Pydantic
class UserProfile(BaseModel):
    # Name of the user (string)
    name: str
    # Role of the user (string)
    role: str
    # Company associated with the user (string)
    company: str

# Root endpoint to verify if the API is running
@app.get("/")
def read_root():
    # Return a JSON response with a welcome message
    return {"message": "Welcome to The Propels API. All systems nominal."}

# Endpoint to retrieve a mock user profile
@app.get("/api/profile", response_model=UserProfile)
def get_profile():
    # Return static profile data for demonstration
    return {
        "name": "Jane User",
        "role": "Founder",
        "company": "NextGen AI"
    }

# Endpoint to handle user registration (placeholder)
@app.post("/api/register")
def register_user():
    # Return a success status and message
    return {"status": "success", "message": "User registered successfully."}

# Endpoint to handle user login (placeholder)
@app.post("/api/login")
def login_user():
    # Return a success status and a mock JWT token
    return {"status": "success", "token": "fake-jwt-token-123"}

# Execution block to run the server locally
if __name__ == "__main__":
    # Import uvicorn, the ASGI server implementation
    import uvicorn
    # Start the server on 0.0.0.0:8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
