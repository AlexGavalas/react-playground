import { useFormik } from 'formik';
import * as yup from 'yup';

export const FormikApp = () => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
        },
        validationSchema: yup.object({
            firstName: yup
                .string()
                .max(10, 'Must be 10 characters or less')
                .required('Required field'),
            lastName: yup
                .string()
                .max(10, 'Must be 10 characters or less')
                .required('Required field'),
            email: yup
                .string()
                .email('Invalid email')
                .required('Required field'),
        }),
        onSubmit: (values) => {
            console.log(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <input
                name="firstName"
                value={formik.values.firstName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
            />
            {formik.touched.firstName && formik.errors.firstName && (
                <p>{formik.errors.firstName}</p>
            )}
            <input
                name="lastName"
                value={formik.values.lastName}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
            />
            {formik.touched.lastName && formik.errors.lastName && (
                <p>{formik.errors.lastName}</p>
            )}
            <input
                name="email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
            />
            {formik.touched.email && formik.errors.email && (
                <p>{formik.errors.email}</p>
            )}
            <button>Submit form</button>
        </form>
    );
};
