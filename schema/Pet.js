import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name for this pet."],
    maxlength: [20, "Name cannot be more than 60 characters"],
  },

  poddy_trained: {
    type: Boolean,
  },
});

export default mongoose.models.Pet || mongoose.model("Pet", PetSchema);
