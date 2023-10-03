import mongoose from "mongoose";

//* this one basically has the idea that we will store the common students' info here, so that every time no time is wasted in searching student details

const StudentsSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    rollNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    fullName: { type: String, required: true },
    isMemberOrAlumni: { type: Boolean, required: true, default: false },
    admissionYear: { type: Number, required: true },
    stream: {
        type: String,
        enum: [
            "CSE 1",
            "CSE 2",
            "CSE 3",
            "CSBS",
            "ECE 1",
            "ECE 2",
            "ECE 3",
            "EEE",
            "EE",
            "ME",
            "MCA",
        ],
        required: true,
    },
    passOut: { type: Number, required: true },
    registered: { type: Array<String> },
    attended: { type: Array<String> },
});

export const studentsModel = mongoose.model("Students", StudentsSchema);

export const getStudent = () => studentsModel.find();

export const getStudentsByEmail = (email: string) =>
    studentsModel.findOne({ email });

export const getStudentsByUserName = (username: string) =>
    studentsModel.findOne({ username });

//! will be useful when generating registration details before an event

export const getStudentsByRegistered = (eventName: string) =>
    studentsModel.find({ registered: { $in: [eventName] } });

//! will be useful after an event

export const getStudentsByAttended = (eventName: string) =>
    studentsModel.find({ attended: { $in: [eventName] } });

//* miscellaneous functions

export const deleteStudentById = (id: string) =>
    studentsModel.findOneAndDelete({ _id: id });

export const updateStudentById = (id: string, values: Record<string, any>) =>
    studentsModel.findByIdAndUpdate(id, values);
