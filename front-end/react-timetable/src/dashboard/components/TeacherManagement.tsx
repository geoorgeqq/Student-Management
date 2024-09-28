import { useEffect, useState } from "react";
import {
    Box,
    Button,
    alpha,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    SelectChangeEvent,
} from "@mui/material";
import Header from "./Header";

interface Teacher {
    id: number;
    name: string;
    email: string;
    department: Department;
}

interface Department {
    id: number;
    department_name: string;
}

interface TeacherManagementProps {
    selectedContent: string;
}

interface NewTeacher {
    id: string;
    name: string;
    email: string;
    departmentId: number;
}

export default function TeacherManagement({ selectedContent }: TeacherManagementProps) {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);
    const [currentTeacher, setCurrentTeacher] = useState<NewTeacher>({
        id: "",
        name: "",
        email: "",
        departmentId: 0,
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            const response = await fetch("http://localhost:8080/teachers");
            const data = await response.json();
            setTeachers(data);
        };
        fetchTeachers();
    }, []);

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await fetch("http://localhost:8080/departments");
            const data = await response.json();
            setDepartments(data);
        };
        fetchDepartments();
    }, []);

    const handleOpen = (teacher?: Teacher) => {
        if (teacher) {
            setEditMode(true);
            setCurrentTeacher({
                id: teacher.id.toString(),
                name: teacher.name,
                email: teacher.email,
                departmentId: teacher.department.id,
            });
        } else {
            setEditMode(false);
            setCurrentTeacher({ id: "0", name: "", email: "", departmentId: 0 });
        }
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentTeacher((prev) => ({ ...prev, [name]: name === "departmentId" ? Number(value) : value }));
    };

    const handleDepartmentChange = (event: SelectChangeEvent<number>) => {
        setCurrentTeacher((prev) => ({ ...prev, departmentId: Number(event.target.value) }));
    };

    const handleSaveTeacher = async () => {
        const method = editMode ? "PUT" : "POST";
        const url = editMode ? `http://localhost:8080/teachers/${currentTeacher.id}` : "http://localhost:8080/teachers";

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: currentTeacher.name,
                email: currentTeacher.email,
                department: { id: currentTeacher.departmentId },
            }),
        });

        if (response.ok) {
            const savedTeacher: Teacher = await response.json();
            if (editMode) {
                setTeachers((prev) => prev.map((t) => (t.id === savedTeacher.id ? savedTeacher : t)));
            } else {
                setTeachers((prev) => [...prev, savedTeacher]);
            }
            handleClose();
        } else {
            console.error("Failed to save teacher");
        }
    };

    return (
        <Box
            component="main"
            sx={(theme) => ({
                flexGrow: 1,
                backgroundColor: theme.vars
                    ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                    : alpha(theme.palette.background.default, 1),
                overflow: "auto",
                fontFamily: "Roboto",
            })}
        >
            <Stack
                spacing={2}
                sx={{
                    alignItems: "center",
                    mx: 3,
                    pb: 10,
                    mt: { xs: 8, md: 0 },
                    fontFamily: "Roboto",
                }}
            >
                <Header selectedContent={selectedContent} />



                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Teacher Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Department ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {teachers.map((teacher) => (
                                <TableRow key={teacher.id} onClick={() => handleOpen(teacher)} style={{ cursor: 'pointer' }}>
                                    <TableCell>{teacher.name}</TableCell>
                                    <TableCell>{teacher.email}</TableCell>
                                    <TableCell>{teacher.department.id}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Button variant="outlined" color="primary" onClick={() => handleOpen()}>
                    Add Teacher
                </Button>
                {/* Add/Edit Teacher Dialog */}
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editMode ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="name"
                            label="Teacher Name"
                            type="text"
                            fullWidth
                            value={currentTeacher.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            value={currentTeacher.email}
                            onChange={handleInputChange}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={currentTeacher.departmentId}
                                onChange={handleDepartmentChange}
                            >
                                <MenuItem value={0} disabled>Select Department</MenuItem>
                                {departments.map((department) => (
                                    <MenuItem key={department.id} value={department.id}>
                                        {department.department_name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTeacher} color="primary">
                            {editMode ? "Save" : "Add"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Box>
    );
}
