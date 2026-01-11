import React, { useContext, useEffect, useState } from 'react'
import InstructorFormsOverviewTable from '../../components/admin/InstructorFormsOverviewTable'
import { useNavigate } from 'react-router-dom'
import { getTemplates, createTemplate, createVersion, deleteTemplate, getVersions, getLastVersionNumberofTemplate, updateTemplate, updateVersion, deleteVersion} from '../../api/templates-versions';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useData } from '../../context/TemplatesVersionsContext';
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

function VersionsTable() {
const getStatusColor = (isActive) =>
  isActive ? "var(--primary-color)" : "gray";
  const [order, setOrder] = React.useState("asc");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const {templates, setTemplates, versions, setVersions} = useData();

  const handleDeleteVersion = async (id) => {
    const res = await deleteVersion(id);
    setVersions(prev => prev.filter(v => v.id !== id));
  }
  const handleActivate = (version) => {
    console.log(version);
// activate v2:
// get all versions of this template (v1,v2)
// for each version who is not v2: set isActive = false
// for v2 set isActive=true
const allVersionsOfTemplate = versions.filter(v => v.templateId === version.templateId);
allVersionsOfTemplate.forEach(v => {
  if (v.id !== version.id) {
    updateVersion(v.id, { isActive: false });
  } else {
    updateVersion(v.id, { isActive: true });
  }
});
setVersions(prevVersions => {
  return prevVersions.map(v => {
    if (v.templateId === version.templateId) {
      return { ...v, isActive: v.id === version.id };
    }
    return v;
  });
});
  }
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
            {grouped.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No data found.
                </TableCell>
              </TableRow>
            ) :
            grouped.map(({ template, versions }) =>
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
                      <button
                      onClick={version.isActive ?  undefined : ()=> handleActivate(version)
                      }
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
                        
                      </button>

                      
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                    <i className="fas fa-eye cursor-pointer"></i>

                      <button><i
                        className="fas fa-trash cursor-pointer"
                        onClick={() => handleDeleteVersion(version.id)}
                      ></i></button></div></TableCell>
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

// TEMPLATE CARD
const TemplateCard = ({title, description, date, numberOfVersions, activeVersion, onclick }) => {
  return (
    <div className='bg-white max-w-96 min-w-96 p-4 rounded-lg mb-4 border border-gray-200'>
      <div className='flex gap-5 justify-between pb-2'>
        <div className='flex gap-1 items-center'>
          <i className={`text-(--primary-color) fa-solid fa-book`}></i>
          <p className='font-bold text-(--primary-color)'>{title}</p>
        </div>
        <div className='flex gap-2 items-center'>
          <i className='fa-regular fa-eye text-gray-500'></i>
          <i className='fa-regular fa-edit text-gray-500'></i>
          <button onClick={onclick}><i className='fa-solid fa-trash text-gray-500'></i></button>
        </div>
      </div>
      <p className='text-gray-500 text-sm h-10'>{description}</p>
      <p className='text-xs text-gray-500'>Created at: {date}</p>
      <hr className='text-gray-300 my-2' />
      <p className='text-sm'>Versions: {numberOfVersions}</p>
      <div className='flex flex-wrap gap-2 items-center pt-2'>
        {Array.from({ length: numberOfVersions }, (_, i) => (
          <span
            key={i}
            className={`px-2 py-1 rounded-full text-xs font-medium ${i + 1 === activeVersion
              ? 'bg-(--primary-color) text-white'
              : 'bg-gray-200 text-gray-700'
              }`}
          >
            v{i + 1} {i + 1 === activeVersion && '(active)'}
          </span>
        ))}
      </div>

    </div>
  )
}

// FORMS.JSX
export default function Forms() {
  const { templates, setTemplates, versions, setVersions } = useData();

  const [openAddTemplate, setOpenAddTemplate] = useState(false);
  const [openAddVersion, setOpenAddVersion] = useState(false);
  const [dataT, setDataT] = useState({ name: "", description: "" });
  const [dataV, setDataV] = useState({ versionNumber: 1, isActive: false });

  const handleDeleteTemplate = async (id) => {
    const res = await deleteTemplate(id);
    setTemplates(prev => prev.filter(t => t.id !== id));
    setVersions(prev => prev.filter(v => v.templateId !== id));
    
  }
  const handleAddTemplate = async () => {
    const newTemplate = {
      ...dataT,
      created_at: new Date().toDateString(),
    };

    const resTemplate = await createTemplate(newTemplate);
    setTemplates(prev => [...prev, resTemplate.data]);
    setDataT({ name: "", description: "" });
    setOpenAddTemplate(false);

    // 2️⃣ Create first version v1 (active) in "versions"
    const newVersion = {
      templateId: resTemplate.data.id,
      versionNumber: 1,
      isActive: true, // v1 active
      created_at: new Date().toDateString(),
    };

    const resVersion = await createVersion(resTemplate.data.id, newVersion);
    setVersions(prev => [...prev, resVersion.data]);
  };

  const handleAddVersion = async (templateId) => {
  if (!templateId) return;

  const lastVersionNumber = await getLastVersionNumberofTemplate(templateId);

  const newVersion = {
    templateId,
    versionNumber: lastVersionNumber + 1,
    isActive: false,
    created_at: new Date().toDateString(),
  };

  const res = await createVersion(templateId, newVersion);
  setVersions(prev => [...prev, res.data]);
  setOpenAddVersion(false);
};



  // Set default templateId when templates are loaded
  useEffect(() => {
    if (templates.length > 0) {
      setDataV(prev => ({ ...prev, templateId: templates[0].id }));
    }
  }, [templates]);


  const navigate = useNavigate();
  return (
    <div>
      <div className='pb-4 flex flex-col gap-3'>
        <p className='text-(--primary-color) text-3xl font-bold'>Forms Management</p>
        <p className="text-md">Manage form templates and versions. View instructor forms and submission status.
        </p>
      </div>

      <div className='flex justify-between items-center pb-4'>
        <p className='text-(--primary-color) font-bold text-lg'>Templates and Versions</p>
        <div className='flex gap-2'>
          <button onClick={() => setOpenAddVersion(true)} className="px-2 py-1 border border-gray-500 hover:bg-gray-300 hover:transition-colors hover:duration-500 rounded-lg  transition-colors duration-500"
          >Add Version</button>

          <button onClick={() => setOpenAddTemplate(true)} className="px-2 py-1 bg-(--primary-color) text-white rounded-lg hover:bg-(--primary-color-hover) transition-colors duration-500"
          >Add Template</button>
        </div>
      </div>
      <div className='flex gap-5 overflow-x-scroll mb-4 scroll-smooth'>
        {templates.length === 0 ? <p className="p-4 text-sm text-gray-500">No templates found.</p> :
          templates
         .map(t => {
          return <TemplateCard
            key={t.id}
            title={t.name}
            description={t.description}
            date={t.created_at}
            numberOfVersions={versions.filter(v => v.templateId === t.id).length}
            activeVersion={versions.find(v => v.templateId === t.id && v.isActive)?.versionNumber}
            onclick={() => handleDeleteTemplate(t.id)}
          />
        })}


      </div>
      <div className='w-full bg-white rounded mb-4'>
        <VersionsTable />
      </div>
      <div className='w-full bg-white rounded'>
        <InstructorFormsOverviewTable />
      </div>


      <Dialog
        open={openAddTemplate}
        onClose={() => {
          setOpenAddTemplate(false);
        }}
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle className="text-(--primary-color)">Add Template</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className='flex flex-col'> <label htmlFor="name">Select template name:</label>

            <input required type="text" onChange={(e) => setDataT({ ...dataT, name: e.target.value })}
              id='name' className='border rounded p-1 border-gray-400' />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="description">Description:</label>
            <textarea required onChange={(e) => setDataT({ ...dataT, description: e.target.value })}
              name="description" className='border rounded p-1 border-gray-400' maxLength={100}></textarea>
          </div>

          <small className='italic'>This template will have v1 as active.</small>

        </DialogContent>

        <DialogActions>
          <button
            className="border border-gray-400 p-1 rounded w-16"
            onClick={() => setOpenAddTemplate(false)}
          >
            Cancel
          </button>

          <button
            className="bg-(--primary-color) text-white p-1 rounded w-16"
            onClick={() => handleAddTemplate()}
          >
            Add
          </button>
        </DialogActions>
      </Dialog>


      <Dialog
        open={openAddVersion}
        onClose={() => {
          setOpenAddVersion(false);
        }}
        fullWidth
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle className="text-(--primary-color)">Add Version</DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <div className='flex flex-col'> <label htmlFor="name">Select template name:</label>
            <select value={dataV.templateId} onChange={(e) => setDataV({ ...dataV, templateId: e.target.value})}
              id='name' className='border rounded p-1 border-gray-400'>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>

              ))}
            </select>
          </div>

          <small className='italic'>An incremented value of the previous version will be added.</small>

        </DialogContent>

        <DialogActions>
          <button
            className="border border-gray-400 p-1 rounded w-16"
            onClick={() => setOpenAddVersion(false)}
          >
            Cancel
          </button>

          <button
            className="bg-(--primary-color) text-white p-1 rounded w-16"
            onClick={() => handleAddVersion(dataV.templateId)}
          >
            Add
          </button>
        </DialogActions>
      </Dialog>


    </div>
  )
}
