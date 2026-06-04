import {
    getNotifications, markAsRead
} from '../services/notificationService.js';

export const getUserNotifications =
    async (
        req,
        res
    ) => {

        try {

            const notifications =
                await getNotifications(
                    req.user.id
                );

            res.json({

                success: true,

                data:
                    notifications,

            });

        } catch (error) {

            console.error(error);

            res.status(500).json({

                success: false,

                message:
                    error.message,

            });

        }

    };

export const readNotification =
    async (
        req,
        res
    ) => {

        try {

            const {
                id
            } = req.params;

            await markAsRead(
                id
            );

            res.json({

                success: true

            });

        }

        catch (
        error
        ) {

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    };