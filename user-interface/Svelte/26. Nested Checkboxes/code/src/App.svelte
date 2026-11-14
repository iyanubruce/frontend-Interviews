<script>
  const checkboxesData = [
    {
      id: 1,
      name: 'Electronics',
      checked: false,
      children: [
        { id: 2, name: 'Mobile phones', checked: false },
        { id: 3, name: 'Laptops', checked: false },
      ],
    },
    { id: 4, name: 'Books', checked: false },
  ];
</script>

<h1>Hello world</h1>
<pre>{JSON.stringify(checkboxesData, null, 2)}</pre>

