<script>
  import DataTable from "./DataTable.svelte";
  import houses from "./data/houses";
  import users from "./data/users";

  const userColumns = [
    {
      label: "ID",
      key: "id",
      renderCell: (row) => row.id,
      comparator: (a, b, direction) => {
        const result = a.id - b.id;
        return direction === "asc" ? result : -result;
      },
      filterType: null,
    },
    {
      label: "Name",
      key: "name",
      renderCell: (row) => row.name,
      comparator: (a, b, direction) => {
        const result = a.name.localeCompare(b.name);
        return direction === "asc" ? result : -result;
      },
      filterType: "string",
    },
    {
      label: "Age",
      key: "age",
      renderCell: (row) => row.age,
      comparator: (a, b, direction) => {
        const result = a.age - b.age;
        return direction === "asc" ? result : -result;
      },
      filterType: "range",
    },
    {
      label: "Occupation",
      key: "occupation",
      renderCell: (row) => row.occupation,
      comparator: (a, b, direction) => {
        const result = a.occupation.localeCompare(b.occupation);
        return direction === "asc" ? result : -result;
      },
      filterType: "string",
    },
  ];
  const houseColumns = [
    {
      label: "ID",
      key: "id",
      renderCell: (row) => row.id,
      comparator: (a, b, direction) => {
        const result = a.id - b.id;
        return direction === "asc" ? result : -result;
      },
      filterType: null,
    },
    {
      label: "Street",
      key: "street",
      renderCell: (row) => row.street,
      comparator: (a, b, direction) => {
        const result = a.street.localeCompare(b.street);
        return direction === "asc" ? result : -result;
      },
      filterType: "string",
    },
    {
      label: "City",
      key: "city",
      renderCell: (row) => row.city,
      comparator: (a, b, direction) => {
        const result = a.city.localeCompare(b.city);
        return direction === "asc" ? result : -result;
      },
      filterType: "string",
    },
    {
      label: "State",
      key: "state",
      renderCell: (row) => row.state,
      comparator: (a, b, direction) => {
        const result = a.state.localeCompare(b.state);
        return direction === "asc" ? result : -result;
      },
      filterType: "string",
    },
    {
      label: "Built Year",
      key: "built_year",
      renderCell: (row) => row.built_year,
      comparator: (a, b, direction) => {
        const result = a.built_year - b.built_year;
        return direction === "asc" ? result : -result;
      },
      filterType: "range",
    },
  ];
</script>

<h2>Users</h2>
<DataTable data={users} columns={userColumns} />

<br />

<h2>Houses</h2>
<DataTable data={houses} columns={houseColumns} />
