const steps = [

    // ==========================
    // Step 1 - Personal
    // ==========================
    {
        title: "Personal Information",
        section: "personal",

        fields: [

            {
                id: "firstName",
                label: "First Name",
                type: "text",
                required: true,
                placeholder: "Enter First Name"
            },

            {
                id: "lastName",
                label: "Last Name",
                type: "text",
                required: true,
                placeholder: "Enter Last Name"
            },

            {
                id: "gender",
                label: "Gender",
                type: "select",
                required: true,
                options: [
                    "Male",
                    "Female",
                    "Other"
                ]
            },
            {
                id: "dob",
                label: "Date of Birth",
                type: "date",
                required: true
            },

            {
                id: "fatherName",
                label: "Father Name",
                type: "text",
                required: true,
                placeholder: "Enter Father Name"
            },

            {
                id: "motherName",
                label: "Mother Name",
                type: "text",
                required: true,
                placeholder: "Enter Mother Name"
            },

            {
                id: "email",
                label: "Email",
                type: "email",
                required: true,
                placeholder: "Enter Email"
            },

            {
                id: "phone",
                label: "Mobile Number",
                type: "tel",
                required: true,
                placeholder: "Enter Mobile Number"
            }

        ]

    },

    // ==========================
    // Step 2 - Address
    // ==========================

    {

        title: "Address Information",

        section: "address",

        fields: [

            {
                id: "country",
                label: "Country",
                type: "text",
                required: true,
                placeholder: "Enter Country"
            },

            {
                id: "state",
                label: "State",
                type: "text",
                required: true,
                placeholder: "Enter State"
            },

            {
                id: "city",
                label: "City",
                type: "text",
                required: true,
                placeholder: "Enter City"
            },

            {
                id: "pinCode",
                label: "PIN Code",
                type: "text",
                required: true,
                placeholder: "Enter PIN Code"
            }

        ]

    },

    // ==========================
    // Step 3 - Education
    // ==========================

    {

        title: "Education",

        section: "education",

        fields: [

            {
                id: "dob",
                label: "Date of Birth",
                type: "date",
                required: true
            },

            {
                id: "tenthSchool",
                label: "10th School Name",
                type: "text",
                required: true,
                placeholder: "Enter School Name"
            },

            {
                id: "tenthBoard",
                label: "10th Board",
                type: "text",
                required: true,
                placeholder: "CBSE / ICSE / State Board"
            },

            {
                id: "tenthPassingYear",
                label: "10th Passing Year",
                type: "number",
                required: true,
                placeholder: "2019"
            },

            {
                id: "tenthPercentage",
                label: "10th Percentage / CGPA",
                type: "text",
                required: true,
                placeholder: "85% / 8.5"
            },

            {
                id: "twelfthSchool",
                label: "12th School Name",
                type: "text",
                required: true,
                placeholder: "Enter School Name"
            },

            {
                id: "twelfthBoard",
                label: "12th Board",
                type: "text",
                required: true,
                placeholder: "CBSE / State Board"
            },

            {
                id: "twelfthPassingYear",
                label: "12th Passing Year",
                type: "number",
                required: true,
                placeholder: "2021"
            },

            {
                id: "twelfthPercentage",
                label: "12th Percentage / CGPA",
                type: "text",
                required: true,
                placeholder: "88% / 8.8"
            },

            {
                id: "graduationDegree",
                label: "Graduation Degree",
                type: "text",
                required: true,
                placeholder: "BCA / B.Tech / B.Sc"
            },

            {
                id: "college",
                label: "Graduation College / University",
                type: "text",
                required: true,
                placeholder: "Enter College Name"
            },

            {
                id: "course",
                label: "Course / Branch",
                type: "text",
                required: true,
                placeholder: "Computer Science"
            },

            {
                id: "graduationYear",
                label: "Graduation Passing Year",
                type: "number",
                required: true,
                placeholder: "2025"
            },

            {
                id: "graduationPercentage",
                label: "Graduation Percentage / CGPA",
                type: "text",
                required: true,
                placeholder: "8.3 / 83%"
            },

            {
                id: "mastersDegree",
                label: "Master's Degree",
                type: "text",
                required: false,
                placeholder: "MCA / MBA / M.Tech"
            },

            {
                id: "mastersCollege",
                label: "Master's College / University",
                type: "text",
                required: false,
                placeholder: "Enter College Name"
            },

            {
                id: "mastersYear",
                label: "Master's Passing Year",
                type: "number",
                required: false,
                placeholder: "2027"
            },

            {
                id: "mastersPercentage",
                label: "Master's Percentage / CGPA",
                type: "text",
                required: false,
                placeholder: "8.8 / 88%"
            }

        ]

    },


    // ==========================
    // Step 4 - Professional
    // ==========================

    {
        title: "Professional Details",

        section: "professional",

        fields: [

            {
                id: "currentStatus",
                label: "Current Status",
                type: "text",
                required: true,
                placeholder: "Student / Working Professional"
            },

            {
                id: "preferredRole",
                label: "Preferred Job Role",
                type: "text",
                required: true,
                placeholder: "Java Developer"
            },

            {
                id: "skills",
                label: "Skills",
                type: "text",
                required: true,
                placeholder: "Java, SQL, HTML, CSS"
            },

            {
                id: "experience",
                label: "Experience Level",
                type: "text",
                required: true,
                placeholder: "Fresher / 1 Year"
            },

            {
                id: "preferredLocation",
                label: "Preferred Location",
                type: "text",
                required: true,
                placeholder: "Noida"
            }

        ]

    },
    // ==========================
    // Step 5 - Social Profiles
    // ==========================

    {
        title: "Social Profiles",

        section: "social",

        fields: [

            {
                id: "linkedin",
                label: "LinkedIn Profile",
                type: "url",
                required: false,
                placeholder: "https://linkedin.com/in/username"
            },

            {
                id: "github",
                label: "GitHub Profile",
                type: "url",
                required: false,
                placeholder: "https://github.com/username"
            },

            {
                id: "portfolio",
                label: "Portfolio Website",
                type: "url",
                required: false,
                placeholder: "https://yourportfolio.com"
            },
            {
                id: "resume",
                label: "Resume",
                type: "resume",
                required: false
            }

        ]

    },
    // ==========================
    // Step 6 - Review Profiles
    // ==========================

    {
        title: "Review Profile",
        section: "review",

        fields: [
            {
                id: "review",
                type: "review"
            }
        ]
    }

];