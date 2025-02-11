import axios from "axios";

export const fetchObjectFactory = (objectName: any) => {
    // ensure app can call its domain
    axios.defaults.baseURL = process.env.NEXTAUTH_URL;

    const fetchObject = async (filter?: Record<string, any>, projection?: Record<string, any>, options?: Record<string, any>) => {
        try {
            const params = new URLSearchParams();

            if (!!filter) {
                params.set('filter', JSON.stringify(filter));
            }

            if (!!projection) {
                params.set('projection', JSON.stringify(projection));
            }

            if (!!options) {
                params.set('options', JSON.stringify(options));
            }

            const query = params.toString();
            const response = await axios.get(`/api/${objectName}?${query}`);


            // Axios automatically checks for status code errors, so no need to manually throw here
            return response.data;
        } catch (error) {
            console.error(`Error fetching ${objectName}:`, error);

            // Return an empty array or handle the error appropriately
            return [];
        }
    }

    return fetchObject;
};
