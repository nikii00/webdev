import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField, Button, Typography, Container, Paper, AppBar, Toolbar, Link, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, InputAdornment, Dialog, DialogTitle, DialogContent, DialogActions
} from '@material-ui/core';
import { Search, Edit, Delete, Add } from '@material-ui/icons';
import useSWR, { mutate } from 'swr';
import axios from 'axios';

interface Student {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  bio: string;
}

const StudentSchema = Yup.object().shape({
  firstname: Yup.string().required('First name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  lastname: Yup.string().required('Last name is required'),
  bio: Yup.string(),
});

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const StudentProfileForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data, error } = useSWR<Student[]>(`/api/student-profile?search=${searchQuery}`, fetcher);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleEdit = (id: number) => {
    setIsEditing(id);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/student-profile?id=${id}`);
      mutate(`/api/student-profile?search=${searchQuery}`);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(null);
  };

  return (
    <div style={{ backgroundColor: '#f0f0f0', backgroundSize: 'cover', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Student Management
          </Typography>
          <Link href="/profile" color="inherit" style={{ margin: '0 10px' }}>
            Profile
          </Link>
          <Link href="/Student-profile" color="inherit" style={{ margin: '0 10px' }}>
            Student Profile
          </Link>
          <Link href="/" color="inherit" style={{ margin: '0 10px' }}>
            Logout
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Paper style={{ padding: 20, marginTop: 20 }}>
          <Typography variant="h4" gutterBottom>
            Student Profiles
          </Typography>
          <TextField style={{ width: '1200px', marginLeft:'18px', outlineColor: '#fff' }}
            className="search-field"
            label="Search by name"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            className="add-button"
            variant="contained"
            color="primary"
            startIcon={<Add />}
            style={{ marginTop: -230, backgroundColor: 'lightblue', color: 'black', marginLeft: 1100 }}
            onClick={() => setOpen(true)}
          >
            Add
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Bio</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((Student: Student, index: number) => (
                  <TableRow key={Student.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{`${Student.firstname} ${Student.lastname}`}</TableCell>
                    <TableCell>{Student.email}</TableCell>
                    <TableCell>{Student.bio}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEdit(Student.id)}>
                          <Edit style={{ color: 'lightblue'}}/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={() => handleDelete(Student.id)}>
                          <Delete style={{ color: 'lightblue' }}/>
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{isEditing === null ? 'Add New Student' : 'Edit Student'}</DialogTitle>
            <DialogContent>
              <Formik
                initialValues={
                  isEditing === null
                    ? { firstname: '', lastname: '', email: '', bio: '' }
                    : data.find(emp => emp.id === isEditing) || { firstname: '', lastname: '', email: '', bio: '' }
                }
                validationSchema={StudentSchema}
                onSubmit={async (values, { setSubmitting, resetForm }) => {
                  try {
                    if (isEditing === null) {
                      await axios.post('/api/student-profile', values);
                    } else {
                      await axios.put(`/api/student-profile?id=${isEditing}`, values);
                    }
                    mutate(`/api/student-profile?search=${searchQuery}`); 
                    handleClose();
                    resetForm();
                    setSubmitting(false);
                  } catch (err) {
                    console.error('Submit error', err);
                  }
                }}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <Field
                      as={TextField}
                      name="firstname"
                      label="First Name"
                      fullWidth
                      error={touched.firstname && !!errors.firstname}
                      helperText={touched.firstname && errors.firstname}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="lastname"
                      label="Last Name"
                      fullWidth
                      error={touched.lastname && !!errors.lastname}
                      helperText={touched.lastname && errors.lastname}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="email"
                      label="Email"
                      fullWidth
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
                      style={{ marginBottom: 20 }}
                    />
                    <Field
                      as={TextField}
                      name="bio"
                      label="Bio"
                      fullWidth
                      multiline
                      rows={4}
                      style={{ marginBottom: 20 }}
                    />
                    <DialogActions>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Save
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                    </DialogActions>
                  </Form>
                )}
              </Formik>
            </DialogContent>
          </Dialog>
        </Paper>
      </Container>
      <footer style={{ backgroundColor: '#f0f0f0', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Nikita Abela. All rights reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default StudentProfileForm;