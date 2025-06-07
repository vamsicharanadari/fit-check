import 'dotenv/config';

export default {
    expo: {
        name: 'fit-check',
        slug: 'fit-check',
        version: '1.0.0',
        extra: {
            "eas": {
                "projectId": "a8e39552-fb28-49ca-b23d-929f1cf3614a"
            },
            BASE_URL: process.env.BASE_URL,
        },
        android: {
            package: 'com.adarivamsi.fitcheck'
        }
    },
};