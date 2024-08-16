import User from "../models/User.js";
import Post from "../models/Post.js";

export const getUsersByAttributes = async (req, res) => {
  try {
    // res.send("Hello");
    
    // Extract query parameters to use as search criteria
    const queryAttributes = { ...req.query };


    const { searchType , ...rest } = queryAttributes;
    // Use find to get all users that match the query attributes
    const users = await User.find(rest);
    
    if (!users.length) {
      console.log("No users found");
      return res.status(404).json({ _id: "UsersNotFound", message: "No users found" });
    }
    console.log("users:" , users);
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeSearchFilterFromHistory = async (req, res) => {
  try {


    const userId = req.body._id;
    const indexToRemove = req.body.indexToRemove;


    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found");
      return res.status(404).json({ _id: "UserNotFound", message: "User not found" });
    }

    // Remove the specified filter from the history
    const updatedSearchingFiltersHistory = user.previousSearchingFilters.filter(
      (filter, i) => i !== indexToRemove
    );

    user.previousSearchingFilters = updatedSearchingFiltersHistory;
    user.save();
    res.status(200);
  } catch (err) {
    console.error("Error fetching user's search filter history:", err);
    res.status(500).json({ message: err.message });
  }
  
};

export const getUserSearchingFiltersHistory = async (req, res) => {
  try {


    const userId = req.params.id;
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ _id: "UserNotFound", message: "User not found" });
    }
    
    // Add the new filter to the history
    const searchingFiltersHistory = user.previousSearchingFilters;

    res.status(200).json({result: searchingFiltersHistory});
  } catch (err) {
    console.error("Error fetching user's search filter history:", err);
    res.status(500).json({ message: err.message });
  }
};

export const updateUserSearchingFiltersHistory = async (req, res) => {
  try {


    const userId = req.body._id;
    const { ["_id"]: _, ...justFilters } = req.body;


    // Find the user by ID
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      console.log("User not found");
      return res.status(404).json({ _id: "UserNotFound", message: "User not found" });
    }


    // Ensure that the search filter history does not exceed 5 items
    if (userToUpdate.previousSearchingFilters.length >= 5) {
      userToUpdate.previousSearchingFilters.shift();
    }

    // Add the new filter to the history
    userToUpdate.previousSearchingFilters.push(justFilters);

    // Save the updated user document
    await userToUpdate.save();

    res.status(200).json(userToUpdate);
  } catch (err) {
    console.error("Error updating user's search filter history:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getPostsByAttributes = async (req, res) => {
  try {
    // res.send("Hello");
    
    // Extract query parameters to use as search criteria
    const queryAttributes = { ...req.query };

    const { searchType , ...rest } = queryAttributes;

    
    // Use find to get all posts that match the query attributes
    const posts = await Post.find(rest);
    
    if (!posts.length) {
      return res.status(404).json({ _id: "PostsNotFound", message: "No posts found" });
    }
    
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getContentByFreeTextSearch = async (req, res) => {
  try {
    const searchTerm = req.query.freeText;
    // Fetch all posts and users
    const posts = await Post.find().lean();
    const users = await User.find().lean();

    // Get a sample post and user to determine fields
    const randomPost = await Post.findOne().lean();
    const randomUser = await User.findOne().lean();

    if (!randomPost) {
      return res.status(404).json({ _id: "PostNotFound", message: "No posts found in the collection." });
    }
    
    if (!randomUser) {
      return res.status(404).json({ _id: "UserNotFound", message: "No users found in the collection." });
    }

    const postSearchFields = Object.keys(randomPost); // Get all fields for posts
    const userSearchFields = Object.keys(randomUser); // Get all fields for users
    const results = new Set();
    const seenPostIds = new Set();
    const seenUserIds = new Set();

    // Function to check if a field value contains the search term
    const matchesSearchTerm = (fieldValue) => 
      fieldValue && String(fieldValue).toLowerCase().includes(searchTerm.toLowerCase());

    // Loop through each post and each field
    posts.forEach(post => {
      if (seenPostIds.has(post._id)) return; // Skip if already seen
      postSearchFields.forEach(field => {
        const fieldValue = post[field];
        if (Array.isArray(fieldValue)) {
          if (fieldValue.some(element => matchesSearchTerm(element))) {
            results.add(post); // Add post to results
            seenPostIds.add(post._id);
            console.log("Found in array field");
            return;
          }
        } else if (matchesSearchTerm(fieldValue)) {
          results.add(post); // Add post to results
          seenPostIds.add(post._id);
          console.log("Found in field");
          return;
        }
      });
    });

    // Loop through each user and each field
    users.forEach(user => {
      if (seenUserIds.has(user._id)) return; // Skip if already seen
      userSearchFields.forEach(field => {
        const fieldValue = user[field];
        if (Array.isArray(fieldValue)) {
          if (fieldValue.some(element => matchesSearchTerm(element))) {
            results.add(user); // Add user to results
            seenUserIds.add(user._id);
            console.log("Found in array field");
            return;
          }
        } else if (matchesSearchTerm(fieldValue)) {
          results.add(user); // Add user to results
          seenUserIds.add(user._id);
          console.log("Found in field");
          return;
        }
      });
    });

    if (results.size === 0) {
      console.log("No content found with the given search term");
      return res.status(404).json({ _id: "ContentNotFound", message: "No content found with the given search term" });
    }

    // Convert the Set to an Array for sending the response
    res.status(200).json(Array.from(results));
  } catch (err) {
    console.error("Error fetching content by free text search:", err);
    res.status(500).json({ message: err.message });
  }
};








