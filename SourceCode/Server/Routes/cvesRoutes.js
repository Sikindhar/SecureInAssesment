import express from "express";
import { 
  getCVEById, 
  getCVEsByYear, 
  getCVEsBySeverity, 
  getCVEsModifiedInDays,
  getCVEList ,
  getTotalCVEs
} from "../Controllers/cvesController.js"; 

const router = express.Router();

router.get("/count",getTotalCVEs);

router.get("/list", getCVEList); 

router.get("/getById/:id", getCVEById);

router.get("/year/:year", getCVEsByYear);

router.get("/severity/:score", getCVEsBySeverity);

router.get("/modified/:days", getCVEsModifiedInDays);

export default router;
