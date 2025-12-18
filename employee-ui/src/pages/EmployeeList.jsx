import React, { useEffect, useState, useMemo, useCallback } from "react";
import { getEmployees, deleteEmployee, addEmployee, updateEmployee } from "../services/employeeApi";
import { useNavigate } from "react-router-dom";

import {
    Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography, Box, TextField, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
    Card, Avatar, Chip, IconButton, Grid, InputAdornment, TablePagination, Fade, Grow,
    useTheme, alpha, Checkbox, Skeleton, Tooltip, Collapse
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditTwoToneIcon from "@mui/icons-material/EditTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded"; // New Import
import AssessmentTwoToneIcon from "@mui/icons-material/AssessmentTwoTone";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useToast } from "../ToastContext";

// --- Analytics Components (Embedded for simplicity) ---
// ... (AnalyticsDashboard code remains unchanged, skipping for brevity in replacement if not touched, but since I am using replace_file_content on a large block, I should be careful.
// actually, let's use MULTI_REPLACE to be safer and avoid re-printing the whole file)
// Wait, I can't use multi_replace in the middle of a thought if I already selected replace_file_content.
// I will cancel this and use multi_replace.
// NO, wait. I can just target the specific areas.

// 1. Imports
// 2. Logic inside component
// 3. UI inside return
// Multi-replace is better here.

// --- Analytics Components (Embedded for simplicity) ---
const AnalyticsDashboard = ({ employees }) => {
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";

    // 1. Department Data
    const deptData = useMemo(() => {
        const counts = {};
        employees.forEach(e => { counts[e.department] = (counts[e.department] || 0) + 1 });
        const total = employees.length;
        return Object.keys(counts).map(dept => ({
            name: dept,
            value: counts[dept],
            percent: (counts[dept] / total) * 100
        })).sort((a, b) => b.value - a.value);
    }, [employees]);

    // 2. Salary Data
    const salaryData = useMemo(() => {
        const ranges = { "< 5L": 0, "5L-10L": 0, "10L-20L": 0, "> 20L": 0 };
        employees.forEach(e => {
            const s = e.salary;
            if (s < 500000) ranges["< 5L"]++;
            else if (s < 1000000) ranges["5L-10L"]++;
            else if (s < 2000000) ranges["10L-20L"]++;
            else ranges["> 20L"]++;
        });
        const max = Math.max(...Object.values(ranges));
        return Object.keys(ranges).map(r => ({ name: r, value: ranges[r], max }));
    }, [employees]);

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Dept Breakdown */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 2 }}>Department Breakdown</Typography>
                    <Stack spacing={1.5}>
                        {deptData.map((d, i) => (
                            <Box key={d.name}>
                                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                                    <Typography variant="body2" fontWeight="600">{d.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{d.value} ({Math.round(d.percent)}%)</Typography>
                                </Stack>
                                <Box sx={{ width: '100%', height: 8, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', borderRadius: 4 }}>
                                    <Box sx={{
                                        width: `${d.percent}%`, height: '100%', borderRadius: 4,
                                        bgcolor: theme.palette.primary.main,
                                        opacity: 0.5 + (i * 0.1) // varied opacity
                                    }} />
                                </Box>
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            </Grid>
            {/* Salary Dist */}
            <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="700" sx={{ mb: 3 }}>Salary Distribution</Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-around" spacing={2} sx={{ height: 160 }}>
                        {/* Pie Chart */}
                        <Box sx={{ position: 'relative', width: 140, height: 140 }}>
                            <Box sx={{
                                width: '100%',
                                height: '100%',
                                borderRadius: '50%',
                                background: `conic-gradient(
                                    ${salaryData.map((d, i, arr) => {
                                    const start = arr.slice(0, i).reduce((sum, item) => sum + (item.value / (employees.length || 1)) * 100, 0);
                                    const end = start + (d.value / (employees.length || 1)) * 100;
                                    const color = theme.palette.mode === 'dark'
                                        ? ['#818cf8', '#34d399', '#f472b6', '#fbbf24'][i % 4]
                                        : ['#6366f1', '#10b981', '#ec4899', '#f59e0b'][i % 4];
                                    return `${color} ${start}% ${end}%`;
                                }).join(', ')}
                                )`,
                                boxShadow: theme.palette.mode === 'dark'
                                    ? '0 0 0 5px rgba(255,255,255,0.05)'
                                    : '0 0 0 5px rgba(0,0,0,0.05)',
                                transition: 'all 0.5s ease'
                            }} />
                            {/* Inner Circle Overlay for Depth */}
                            <Box sx={{
                                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                borderRadius: '50%',
                                background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.1) 100%)',
                                pointerEvents: 'none'
                            }} />
                        </Box>

                        {/* Legend */}
                        <Stack spacing={1.5} sx={{ minWidth: 120 }}>
                            {salaryData.map((d, i) => (
                                <Stack key={d.name} direction="row" alignItems="center" spacing={1}>
                                    <Box sx={{
                                        width: 12, height: 12, borderRadius: 1,
                                        bgcolor: theme.palette.mode === 'dark'
                                            ? ['#818cf8', '#34d399', '#f472b6', '#fbbf24'][i % 4]
                                            : ['#6366f1', '#10b981', '#ec4899', '#f59e0b'][i % 4]
                                    }} />
                                    <Typography variant="body2" color="text.primary" fontWeight={600}>
                                        {d.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        ({Math.round((d.value / (employees.length || 1)) * 100)}%)
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Stack>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ id: "", name: "", department: "", salary: "" });
    const [confirm, setConfirm] = useState({ open: false, ids: [] }); // Array for bulk delete
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]); // Selected IDs
    const [showAnalytics, setShowAnalytics] = useState(false);

    const navigate = useNavigate();
    const theme = useTheme();
    const isDark = theme.palette.mode === "dark";
    const { showToast } = useToast();

    // Load Data
    const load = useCallback(async (f = {}) => {
        setLoading(true);
        try {
            const params = {};
            if (f.id) params.Id = f.id;
            if (f.name) params.Name = f.name;
            if (f.department) params.Department = f.department;
            if (f.salary) params.Salary = f.salary;
            const res = await getEmployees(params);
            setEmployees(res.data || []);
            setSelected([]); // Clear selection on reload
        } catch (err) {
            console.error(err);
            showToast("Failed to load employees", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => { load(); }, [load]);

    // Handlers
    const onSearch = () => {
        setPage(0);
        load(filter);
        showToast("Search filters applied", "info");
    };

    const onClear = () => {
        setFilter({ id: "", name: "", department: "", salary: "" });
        setPage(0);
        load({});
        showToast("Filters cleared", "info");
    };

    const onDelete = async () => {
        try {
            // Promise.all for bulk delete (real app would use bulk endpoint)
            await Promise.all(confirm.ids.map(id => deleteEmployee(id)));
            setConfirm({ open: false, ids: [] });
            showToast(`${confirm.ids.length} Employee(s) deleted successfully`, "success");
            load(filter);
        } catch (err) {
            console.error(err);
            // Some checks might fail, usually we'd want a transaction but here we do best effort
            showToast("Delete operation faced issues", "error");
            load(filter);
        }
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            // Select all visible on current page or all? Usually current page for safety, but user might expect all.
            // Let's do all currently filtered employees for simpler UX "Bulk Action"
            const newSelected = employees.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleSelectOne = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const onExportCSV = () => {
        // Simple CSV generation
        const headers = ["ID", "Name", "Department", "Salary"];
        const rows = employees.map(e => [e.id, e.name, e.department, e.salary]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employees_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast("Export download started", "success");
    };

    const onDownloadTemplate = () => {
        const headers = ["ID", "Name", "Department", "Salary"];
        const rows = [",John Doe,IT,600000", ",Jane Smith,HR,550000"];
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "employee_upload_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const lines = text.split("\n").map(r => r.trim()).filter(r => r);

            // Determine CSV format from header
            // Expected Formats:
            // 1. ID,Name,Department,Salary
            // 2. Name,Department,Salary
            const firstLine = lines[0].split(",");
            const hasIdHeader = firstLine[0].toLowerCase() === "id" || !isNaN(parseInt(firstLine[0]));
            const startIndex = (firstLine[0].toLowerCase() === "id" || firstLine[0].toLowerCase() === "name") ? 1 : 0;

            let successCount = 0;
            let failCount = 0;
            setLoading(true);

            for (let i = startIndex; i < lines.length; i++) {
                const cols = lines[i].split(",");
                if (cols.length < 3) continue;

                let id, name, department, salary;

                if (cols.length >= 4) {
                    // Assume ID,Name,Dept,Salary
                    [id, name, department, salary] = cols;
                } else {
                    // Assume Name,Dept,Salary
                    [name, department, salary] = cols;
                }

                try {
                    const employeeData = {
                        name: name?.trim(),
                        department: department?.trim(),
                        salary: parseInt(salary?.trim() || "0")
                    };

                    const numericId = parseInt(id?.trim());
                    if (!isNaN(numericId)) {
                        await updateEmployee({ id: numericId, ...employeeData });
                    } else {
                        await addEmployee(employeeData);
                    }
                    successCount++;
                } catch (err) {
                    failCount++;
                    console.error("Import failed for row:", i, err);
                }
            }

            setLoading(false);
            showToast(`Processed ${successCount + failCount} records: ${successCount} successful, ${failCount} failed.`, successCount > 0 ? "success" : "error");
            load({}); // Refresh list

            // Reset input
            event.target.value = null;
        };
        reader.readAsText(file);
    };

    // Pagination
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Derived
    const displayedEmployees = employees.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const isSelected = (id) => selected.indexOf(id) !== -1;

    // Helper for avatar
    const stringToColor = (string) => {
        const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
        let hash = 0;
        for (let i = 0; i < string.length; i++) hash = string.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <Fade in={true} timeout={800}>
            <Stack spacing={4}>
                {/* Stats & Analytics Toggle */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight="700">
                        Total Staff: {loading ? <Skeleton width={60} inline /> : employees.length}
                    </Typography>
                    <Button
                        startIcon={showAnalytics ? <KeyboardArrowUpIcon /> : <AssessmentTwoToneIcon />}
                        onClick={() => setShowAnalytics(!showAnalytics)}
                        variant="soft"
                        sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                    >
                        {showAnalytics ? "Hide Analytics" : "View Analytics"}
                    </Button>
                </Stack>

                <Collapse in={showAnalytics}>
                    <AnalyticsDashboard employees={employees} />
                </Collapse>

                {/* Filters & Actions */}
                <Paper sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                placeholder="Search by ID" size="small" fullWidth
                                value={filter.id} onChange={(e) => setFilter({ ...filter, id: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start"><Box sx={{ opacity: 0.5 }}>#</Box></InputAdornment> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                placeholder="Search Name" size="small" fullWidth
                                value={filter.name} onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                                InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon fontSize="small" sx={{ opacity: 0.5 }} /></InputAdornment> }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <TextField
                                placeholder="Department" size="small" fullWidth
                                value={filter.department} onChange={(e) => setFilter({ ...filter, department: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', gap: 1 }}>
                            <Button variant="contained" onClick={onSearch} sx={{ flex: 1 }}>Search</Button>
                            <Button variant="outlined" color="secondary" onClick={onClear}><RefreshRoundedIcon /></Button>
                        </Grid>
                    </Grid>

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
                        {/* Bulk Actions */}
                        <Box>
                            {selected.length > 0 && (
                                <Fade in={true}>
                                    <Stack direction="row" alignItems="center" spacing={2} sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), px: 2, py: 1, borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight="700" color="primary">{selected.length} Selected</Typography>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteTwoToneIcon />}
                                            onClick={() => setConfirm({ open: true, ids: selected })}
                                        >
                                            Delete
                                        </Button>
                                    </Stack>
                                </Fade>
                            )}
                        </Box>

                        <Stack direction="row" spacing={2}>
                            <Tooltip
                                title={
                                    <Box sx={{ textAlign: 'center', p: 1 }}>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>
                                            Format: ID,Name,Dept,Salary
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', mb: 1, opacity: 0.8 }}>
                                            (Provide ID to update existing records)
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            sx={{ textDecoration: 'underline', cursor: 'pointer', color: 'secondary.light' }}
                                            onClick={(e) => { e.preventDefault(); onDownloadTemplate(); }}
                                        >
                                            Download Template
                                        </Typography>
                                    </Box>
                                }
                                arrow
                                placement="top"
                            >
                                <Button
                                    component="label"
                                    startIcon={<CloudUploadRoundedIcon />}
                                    variant="outlined"
                                    color="info"
                                    sx={{ borderRadius: 3, borderStyle: 'dashed' }}
                                >
                                    Import CSV
                                    <input type="file" hidden accept=".csv" onChange={handleFileUpload} />
                                </Button>
                            </Tooltip>
                            <Button
                                startIcon={<DownloadRoundedIcon />}
                                variant="outlined"
                                onClick={onExportCSV}
                                disabled={employees.length === 0}
                            >
                                Export CSV
                            </Button>
                            <Button
                                startIcon={<AddRoundedIcon />}
                                variant="contained"
                                color="secondary"
                                onClick={() => navigate("/employees/add")}
                                sx={{
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                                    boxShadow: "0 4px 14px 0 rgba(124, 58, 237, 0.4)"
                                }}
                            >
                                Add Employee
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>

                {/* Data Table */}
                <Paper sx={{ overflow: 'hidden' }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            color="primary"
                                            indeterminate={selected.length > 0 && selected.length < employees.length}
                                            checked={employees.length > 0 && selected.length === employees.length}
                                            onChange={handleSelectAll}
                                        />
                                    </TableCell>
                                    <TableCell>Employee Details</TableCell>
                                    <TableCell>Department</TableCell>
                                    <TableCell>Salary</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {loading ? (
                                    // SKELETON LOADING ROWS
                                    [1, 2, 3, 4, 5].map((n) => (
                                        <TableRow key={n}>
                                            <TableCell padding="checkbox"><Skeleton variant="rectangular" width={24} height={24} /></TableCell>
                                            <TableCell><Stack direction="row" spacing={2}><Skeleton variant="circular" width={40} height={40} /><Box><Skeleton width={120} /><Skeleton width={80} /></Box></Stack></TableCell>
                                            <TableCell><Skeleton width={100} /></TableCell>
                                            <TableCell><Skeleton width={80} /></TableCell>
                                            <TableCell><Skeleton width={60} /></TableCell>
                                            <TableCell align="right"><Skeleton width={80} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : employees.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                            <Typography variant="body1" color="text.secondary">No employees found matching criteria.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : displayedEmployees.map((e, index) => {
                                    const isItemSelected = isSelected(e.id);
                                    return (
                                        <Grow in={true} timeout={300 + (index * 50)} key={e.id}>
                                            <TableRow
                                                hover
                                                selected={isItemSelected}
                                                onClick={(event) => handleSelectOne(event, e.id)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    '&:last-child td, &:last-child th': { border: 0 }
                                                }}
                                            >
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        color="primary"
                                                        checked={isItemSelected}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={2.5} alignItems="center">
                                                        <Avatar
                                                            sx={{
                                                                bgcolor: stringToColor(e.name || "U"),
                                                                width: 44, height: 44,
                                                                boxShadow: `0 4px 8px ${stringToColor(e.name || "U")}40`
                                                            }}
                                                        >
                                                            {(e.name || "U")[0].toUpperCase()}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">{e.name || "Unknown"}</Typography>
                                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>ID: #{e.id}</Typography>
                                                        </Box>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={e.department || "General"}
                                                        size="small"
                                                        sx={{
                                                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                                                            fontWeight: 600,
                                                            color: 'text.secondary'
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={600} fontFamily="monospace" letterSpacing="-0.5px">
                                                        {e.salary?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label="Active" color="success" size="small" variant="filled" sx={{ borderRadius: 1.5, fontWeight: 700, px: 0.5 }} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end" onClick={(e) => e.stopPropagation()}>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => navigate(`/employees/edit/${e.id}`)}
                                                            sx={{ color: 'primary.main', bgcolor: alpha(theme.palette.primary.main, 0.1) }}
                                                        >
                                                            <EditTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => setConfirm({ open: true, ids: [e.id] })}
                                                            sx={{ color: 'error.main', bgcolor: alpha(theme.palette.error.main || '#ef4444', 0.1) }}
                                                        >
                                                            <DeleteTwoToneIcon fontSize="small" />
                                                        </IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        </Grow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={employees.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        sx={{ borderTop: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(0,0,0,0.05)" }}
                    />
                </Paper>

                <Dialog
                    open={confirm.open}
                    onClose={() => setConfirm({ open: false, ids: [] })}
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            p: 2,
                            minWidth: 320,
                            backdropFilter: "blur(20px)",
                            background: isDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)"
                        }
                    }}
                >
                    <DialogTitle sx={{ textAlign: "center", fontWeight: 700 }}>Confirm Deletion</DialogTitle>
                    <DialogContent sx={{ textAlign: "center" }}>
                        <Typography color="text.secondary">
                            Are you sure you want to permanently delete {confirm.ids.length > 1 ? <b>{confirm.ids.length} employees</b> : <b>employee #{confirm.ids[0]}</b>}?
                        </Typography>
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                            This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
                        <Button onClick={() => setConfirm({ open: false, ids: [] })} variant="text" color="inherit">Cancel</Button>
                        <Button variant="contained" color="error" onClick={onDelete} startIcon={<DeleteTwoToneIcon />} sx={{ borderRadius: 3, px: 3 }}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Fade>
    );
}
