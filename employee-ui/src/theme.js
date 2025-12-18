import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
            main: "#4f46e5", // Indigo 600
            light: "#818cf8",
            dark: "#3730a3",
            contrastText: "#ffffff",
        },
        secondary: {
            main: "#10b981", // Emerald 500
            contrastText: "#ffffff",
        },
        background: {
            default: "#f9fafb", // Gray 50
            paper: "#ffffff",
        },
        text: {
            primary: "#111827", // Gray 900
            secondary: "#6b7280", // Gray 500
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#111827",
        },
        h5: {
            fontWeight: 600,
            fontSize: "1.25rem",
        },
        h6: {
            fontWeight: 600,
            fontSize: "1rem",
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    padding: "8px 16px",
                    boxShadow: "none",
                    "&:hover": {
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    },
                },
                containedPrimary: {
                    background: "linear-gradient(45deg, #4f46e5 30%, #4338ca 90%)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "16px",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                    border: "1px solid #e5e7eb",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    backgroundColor: "#f9fafb",
                    fontWeight: 600,
                    color: "#374151",
                    borderBottom: "1px solid #e5e7eb",
                },
                body: {
                    color: "#4b5563",
                },
            },
        },
    },
});

export default theme;
