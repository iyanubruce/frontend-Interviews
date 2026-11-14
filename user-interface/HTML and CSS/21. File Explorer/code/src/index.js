import './styles.css';

import data from './data';
import createFileExplorer from './file-explorer';

createFileExplorer(document.querySelector('#app'), data);
