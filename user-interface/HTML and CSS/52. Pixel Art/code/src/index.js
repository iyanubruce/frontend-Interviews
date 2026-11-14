import './styles.css';

const COLORS = {
  white: '#fff',
  gray: '#e9ecef',
  black: '#000',
  red: '#cc0001',
  orange: '#fb940b',
  yellow: '#ffff01',
  green: '#01cc00',
  teal: '#38d9a9',
  blue: '#228be6',
  purple: '#7950f2',
  beige: '#ff8787',
};

const app = document.querySelector('#app');
app.textContent = 'Hello World!';

const list = document.createElement('ul');
Object.entries(COLORS).forEach(([name, value]) => {
  const item = document.createElement('li');
  item.textContent = name;
  item.style.color = value;
  list.append(item);
});
app.append(list);
