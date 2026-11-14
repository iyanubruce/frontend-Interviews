import './styles.css';

document.querySelector('#app').innerHTML = `
  <form>
    <input type="text" inputmode="numeric" autocomplete="one-time-code" />
    <button type="reset">Reset</button>
    <button type="submit">Submit</button>
  </form>
`;
