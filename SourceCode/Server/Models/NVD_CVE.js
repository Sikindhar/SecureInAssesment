import mongoose from "mongoose";

const cveSchema = new mongoose.Schema(
  {
    cve: {
      id: { type: String, unique: true, required: true }, 
      sourceIdentifier: { type: String }, 
      published: { type: Date, required: true }, 
      lastModified: { type: Date, required: true }, 
      vulnStatus: { type: String }, 
      cveTags: { type: [mongoose.Schema.Types.Mixed] }, 

      descriptions: [
        {
          lang: { type: String, required: true }, 
          value: { type: String, required: true }, 
        }
      ],

      metrics: {
        cvssMetricV2: [
          {
            source: { type: String }, 
            type: { type: String },
            cvssData: {
              version: { type: String },
              vectorString: { type: String },
              baseScore: { type: Number },
              accessVector: { type: String },
              accessComplexity: { type: String },
              authentication: { type: String },
              confidentialityImpact: { type: String },
              integrityImpact: { type: String },
              availabilityImpact: { type: String },
            },
            baseSeverity: { type: String },
            exploitabilityScore: { type: Number },
            impactScore: { type: Number },
            acInsufInfo: { type: Boolean },
            obtainAllPrivilege: { type: Boolean },
            obtainUserPrivilege: { type: Boolean },
            obtainOtherPrivilege: { type: Boolean },
            userInteractionRequired: { type: Boolean },
          }
        ],

        cvssMetricV3: [
          {
            source: { type: String },
            cvssData: {
              version: { type: String },
              vectorString: { type: String },
              baseScore: { type: Number },
            },
            baseSeverity: { type: String },
          }
        ]
      },

      weaknesses: [
        {
          source: { type: String }, 
          type: { type: String }, 
          description: [
            {
              lang: { type: String },
              value: { type: String }
            }
          ]
        }
      ],

      configurations: [
        {
          nodes: [
            {
              operator: { type: String }, 
              negate: { type: Boolean },
              cpeMatch: [
                {
                  vulnerable: { type: Boolean },
                  criteria: { type: String }, 
                  matchCriteriaId: { type: String },
                }
              ]
            }
          ]
        }
      ],

      references: [
        {
          url: { type: String, required: true }, 
          source: { type: String } 
        }
      ]
    }
  },
  { timestamps: true }
);

export default mongoose.model("NVD_CVE", cveSchema);
