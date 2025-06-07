import 'dotenv/config';

export default {
    expo: {
        extra: {
            "eas": {
                "projectId": "a8e39552-fb28-49ca-b23d-929f1cf3614a"
            },
            BASE_URL: process.env.BASE_URL,
        },
    },
};