import NVD_CVE from "../Models/NVD_CVE.js";

export const getTotalCVEs = async (req, res) => {
    try {
        const totalCves = await NVD_CVE.countDocuments();
        res.json({ totalCves });
    } catch (error) {
        res.status(500).json({ message: "Error fetching total CVEs" });
    }
};

export const getCVEById = async (req, res) => {
  try {
    const cve = await NVD_CVE.findOne({ "cve.id": req.params.id });

    if (!cve) return res.status(404).json({ message: "CVE Not Found" });

    res.json(cve);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCVEsByYear = async (req, res) => {
    try {
      const year = req.params.year;
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 20;  
  
      const skip = (page - 1) * limit;
  
      const cves = await NVD_CVE.find({
        "cve.id": { $regex: `^CVE-${year}-` }
      })
        .skip(skip)  
        .limit(limit);  
  
      const totalCves = await NVD_CVE.countDocuments({
        "cve.id": { $regex: `^CVE-${year}-` }
      });
  
      const totalPages = Math.ceil(totalCves / limit);
  
      res.json({
        currentPage: page,
        totalPages: totalPages,
        totalCves: totalCves,
        cves: cves
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getCVEsBySeverity = async (req, res) => {
    try {
      const score = parseFloat(req.params.score);
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 20; 
  
      if (isNaN(score) || score <= 0) {
        return res.status(400).json({ message: "Invalid CVE severity score." });
      }
  
      const skip = (page - 1) * limit;
  
      const cves = await NVD_CVE.find({
        $or: [
          { "cve.metrics.cvssMetricV3.cvssData.baseScore": { $gte: score } },
          { "cve.metrics.cvssMetricV2.cvssData.baseScore": { $gte: score } },
        ],
      })
        .skip(skip) 
        .limit(limit)  
        .sort({ "cve.id": 1 });  
  
      const totalCves = await NVD_CVE.countDocuments({
        $or: [
          { "cve.metrics.cvssMetricV3.cvssData.baseScore": { $gte: score } },
          { "cve.metrics.cvssMetricV2.cvssData.baseScore": { $gte: score } },
        ],
      });
  
      const totalPages = Math.ceil(totalCves / limit);
  
      res.json({
        currentPage: page,
        totalPages: totalPages,
        totalCves: totalCves,
        cves: cves
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getCVEsModifiedInDays = async (req, res) => {
    try {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(req.params.days));
  
      const page = parseInt(req.query.page) || 1;  
      const limit = parseInt(req.query.limit) || 20;  
  
      const skip = (page - 1) * limit;
  
      const cves = await NVD_CVE.find({
        "cve.lastModified": { $gte: daysAgo.toISOString() },
      })
        .skip(skip)  
        .limit(limit)  
        .sort({ "cve.id": 1 });  
  
      const totalCves = await NVD_CVE.countDocuments({
        "cve.lastModified": { $gte: daysAgo.toISOString() },
      });
  
      const totalPages = Math.ceil(totalCves / limit);
  
      res.json({
        currentPage: page,
        totalPages: totalPages,
        totalCves: totalCves,
        cves: cves
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getCVEList = async (req, res) => {
    try {
      let { page = 1, limit = 10, sort = "published" } = req.query;
  
      page = parseInt(page);
      limit = parseInt(limit);
  
      const sortOptions = {
        published: "cve.published",
        lastModified: "cve.lastModified",
      };
  
      const sortField = sortOptions[sort] || "cve.published";

      const totalRecords = await NVD_CVE.countDocuments();
      console.log("Total Records in DB:", totalRecords);
  
      if (totalRecords === 0) {
        return res.status(404).json({ message: "CVE Database is Empty!" });
      }
  
      console.log(`Fetching page ${page}, limit ${limit}, sorting by ${sortField}`);
  
      const cves = await NVD_CVE.find()
        .sort({ [sortField]: 1 })
        .skip((page - 1) * limit)
        .limit(limit);
        

      console.log("Records Fetched:", cves.length);
  
      if (cves.length === 0) {
        return res.status(404).json({ message: "No CVE Found for this Query!" });
      }
  
      res.json({
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        resultsPerPage: limit,
        results: cves,
      });
    } catch (error) {
      console.error(" Error Fetching CVE List:", error.message);
      res.status(500).json({ message: error.message });
    }
  };
  

