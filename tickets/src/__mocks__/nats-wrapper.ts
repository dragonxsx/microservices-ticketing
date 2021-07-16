export const natsWrapper = {
    client: {
        publish: (subject: string, data: any, callback: () => void) => {
            callback();
        }
    }
};