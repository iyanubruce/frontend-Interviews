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
    },
    {
      label: "Name",
      key: "name",
      renderCell: (row) => row.name,
      comparator: (a, b, direction) => {
        const result = a.name.localeCompare(b.name);
        return direction === "asc" ? result : -result;
      },
    },
    {
      label: "Age",
      key: "age",
      renderCell: (row) => row.age,
      comparator: (a, b, direction) => {
        const result = a.age - b.age;
        return direction === "asc" ? result : -result;
      },
    },
    {
      label: "Occupation",
      key: "occupation",
      renderCell: (row) => row.occupation,
      comparator: (a, b, direction) => {
        const result = a.occupation.localeCompare(b.occupation);
        return direction === "asc" ? result : -result;
      },
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
    },
    {
      label: "Street",
      key: "street",
      renderCell: (row) => row.street,
      comparator: (a, b, direction) => {
        const result = a.street.localeCompare(b.street);
        return direction === "asc" ? result : -result;
      },
    },
    {
      label: "City",
      key: "city",
      renderCell: (row) => row.city,
      comparator: (a, b, direction) => {
        const result = a.city.localeCompare(b.city);
        return direction === "asc" ? result : -result;
      },
    },
    {
      label: "State",
      key: "state",
      renderCell: (row) => row.state,
      comparator: (a, b, direction) => {
        const result = a.state.localeCompare(b.state);
        return direction === "asc" ? result : -result;
      },
    },
    {
      label: "Built Year",
      key: "built_year",
      renderCell: (row) => row.built_year,
      comparator: (a, b, direction) => {
        const result = a.built_year - b.built_year;
        return direction === "asc" ? result : -result;
      },
    },
  ];
</script>

<h2>Users</h2>
<DataTable data={users} columns={userColumns} />

<br />

<h2>Houses</h2>
<DataTable data={houses} columns={houseColumns} />
