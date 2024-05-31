import { useState } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Paper, AppBar, Toolbar, Link } from '@material-ui/core';
import useSWR from 'swr';
import axios from 'axios';
import Avatar from '../components/avatar';

const ProfileSchema = Yup.object().shape({
  firstname: Yup.string(),
  lastname: Yup.string(),
  email: Yup.string().email('Invalid email'),
  bio: Yup.string(),
});

const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const ProfileForm = () => {
  const { data, error, mutate } = useSWR('/api/profile', fetcher);
  const [isEditing, setIsEditing] = useState(false);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  const handleEdit = () => setIsEditing(!isEditing);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link href="/profile" color="inherit" style={{ margin: '0 10px' }}>
            Profile
          </Link>
          <Link href="/student-profile" color="inherit" style={{ margin: '0 10px' }}>
            Student Profile
          </Link>
          <Link href="/" color="inherit" style={{ margin: '0 10px' }}>
            Logout
          </Link>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Paper style={{ padding: 20, marginTop: 20 }}>
        <div>
          <Avatar fullName={`${data.firstname} ${data.lastname}`} />
        </div>
          {!isEditing ? (
            <div>
              
              <Typography variant="subtitle1" gutterBottom>
                Name: {data.firstname} {data.lastname}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Email: {data.email}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Bio: {data.bio}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          ) : (
            <Formik
              initialValues={{
                firstname: data.firstname,
                lastname: data.lastname,
                email: data.email,
                bio: data.bio || '',
              }}
              validationSchema={ProfileSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const token = localStorage.getItem('token');
                  await axios.put('/api/profile', values, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  mutate(); 
                  setIsEditing(false);
                } catch (error) {
                  console.error('Profile update error', error);
                }
                setSubmitting(false);
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
                  />
                  <Field
                    as={TextField}
                    name="lastname"
                    label="Last Name"
                    fullWidth
                    error={touched.lastname && !!errors.lastname}
                    helperText={touched.lastname && errors.lastname}
                  />
                  <Field
                    as={TextField}
                    name="email"
                    label="Email"
                    fullWidth
                    error={touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                  />
                  <Field
                    as={TextField}
                    name="bio"
                    label="Bio"
                    fullWidth
                    multiline
                    rows={4}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    style={{ marginRight: 10 }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleEdit}
                  >
                    Cancel
                  </Button>
                </Form>
              )}
            </Formik>
          )}
        </Paper>
      </Container>
      <footer className="footer1" style={{ backgroundColor: 'lightblue', height: '50px' }}>
        <Typography variant="body1" style={{ margin: '0 10px', marginTop: '178px', textAlign: 'center' }}>
          © {new Date().getFullYear()} Nikita Abela. All rights reserved.
        </Typography>
      </footer>
    </>
  );
};

export default ProfileForm;