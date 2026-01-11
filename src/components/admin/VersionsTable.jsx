import * as React from "react";


import {
  getTemplates,
  getVersions,
  deleteVersion,
} from "../../api/templates-versions"

const getStatusColor = (isActive) =>
  isActive ? "var(--primary-color)" : "gray";

export default function VersionsTable() {
  const [order, setOrder] = React.useState("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [templates, setTemplates] = React.useState([]);
  const [versions, setVersions] = React.useState([]);

  React.useEffect(() => {
  const fetchData = async () => {
    const [tRes, vRes] = await Promise.all([
      getTemplates(),
      getVersions(),
      console.log(versions),
      console.log(templates)
    ]);
    setTemplates(tRes.data);
    setVersions(vRes.data);
  };
  fetchData();
}, []);


  // Pagination (per template)
  const paginatedTemplates = templates.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Group versions under templates
  const grouped = React.useMemo(() => {
    return paginatedTemplates.map((template) => ({
      template,
      versions: versions.filter(
        (v) => v.templateId === template.id
      ),
    }));
  }, [paginatedTemplates, versions]);

  const handleRequestSort = () =>
    setOrder(order === "asc" ? "desc" : "asc");

  const handleChangePage = (_e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%" }}>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active
                  direction={order}
                  onClick={handleRequestSort}
                >
                  Template Name
                </TableSortLabel>
              </TableCell>
              <TableCell>Version</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {grouped.map(({ template, versions }) =>
              versions.map((version, index) => (
                <TableRow key={version.id} hover>
                  {/* Template name rowspan */}
                  {index === 0 && (
                    <TableCell rowSpan={versions.length}>
                      {template.name}
                    </TableCell>
                  )}

                  <TableCell>{`v${version.versionNumber}`}</TableCell>

                  <TableCell>
                    {new Date(version.created_at).getMonth()+1}/{new Date(version.created_at).getDate()}/{new Date(version.created_at).getFullYear()}
                  </TableCell>

                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          backgroundColor: getStatusColor(
                            version.isActive
                          ),
                          padding: "5px 10px",
                          fontSize: "0.75rem",
                          borderRadius: "50px",
                          color: "white",
                          width: "120px",
                          textAlign: "center",
                        }}
                      >
                        {version.isActive ? "Currently Active" : "Click to Activate"}
                      </p>

                      
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                    <i className="fas fa-eye cursor-pointer"></i>

                      <i
                        className="fas fa-trash cursor-pointer"
                        onClick={() => deleteVersion(version.id)}
                      ></i></div></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={templates.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
