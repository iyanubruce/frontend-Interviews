import './styles.css';

import createDataTable from './data-table';
import users from './data/users';

createDataTable(document.querySelector('#app'), users);
