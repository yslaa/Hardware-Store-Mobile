import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'https://fixit-api.onrender.com/api/v1/'
: baseURL = 'https://fixit-api.onrender.com/api/v1/'
}

export default baseURL;