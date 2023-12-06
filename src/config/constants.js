import {getCredentials} from '../utils/helper';

/** The line `const {baseURL, AllPaths, mainPath} = getCredentials();` is using destructuring assignment
to extract the values of `baseURL`, `AllPaths`, and `mainPath` from the object returned by the
`getCredentials()` function. **/
const {baseURL, AllPaths, mainPath} = getCredentials();

export {baseURL, AllPaths, mainPath};
