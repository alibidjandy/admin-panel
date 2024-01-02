import { useEffect, useMemo, useState } from "react";
import {
  MRT_EditActionButtons,
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
// import { type any, fakeData, usStates } from "./makeData";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createShop,
  deleteShop,
  getAllShops,
  logout,
  updateShop,
  useDispatch,
  useState as useStateWithoutReact,
} from "../context";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Example = () => {
  const navigate = useNavigate();
  const states = useStateWithoutReact();
  const dispatch = useDispatch();

  const [transformedResponse, setTransformedResponse] = useState<
    {
      id: String;
      shopName: String;
      itemId: String;
      name: String;
      price: number;
      quantity: number;
    }[]
  >([
    {
      id: "",
      shopName: "",
      itemId: "",
      name: "",
      price: 0,
      quantity: 0,
    },
  ]);

  useEffect(() => {
    if (!states?.token) {
      navigate("/");
    }
  }, [states?.token]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllShops(dispatch);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
    if (states!.shops!.length < 1) {
      window.location.reload();
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (states?.shops!.length! > 1) {
      setTransformedResponse(
        states!
          .shops!.map((shop) => {
            const { id, shopName, items } = shop;

            const transformedItems = {
              id,
              shopName: shopName,
              itemId: items[0].itemId,
              name: items[0].name,
              price: items[0].price,
              quantity: items[0].quantity,
            };
            return transformedItems;
          })
          .flat()
      );
    }
  }, [states?.shops]);

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const columns = useMemo<MRT_ColumnDef<any>[]>(() => {
    const shopKeys = states?.shops?.[0]
      ? Object.keys(states.shops[0]).filter((res) => res !== "items")
      : [];
    const itemKeys = states?.shops?.[0]?.items?.[0]
      ? Object.keys(states.shops[0].items[0]).filter((res) => res !== "itemId")
      : [];

    const shopColumns = shopKeys.map((shop, index) => ({
      accessorKey: shop,
      header: shop,
      enableColumnActions: false,
    }));

    const itemColumns = itemKeys.map((shop, index) => ({
      accessorKey: shop,
      header: shop,
      enableColumnActions: false,
    }));

    return [...shopColumns, ...itemColumns];
  }, [validationErrors]);

  //CREATE action
  const handleCreateShop: MRT_TableOptions<any>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateShop(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createShop(values);
    window.location.reload();
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveShop: MRT_TableOptions<any>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateShop(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }

    setValidationErrors({});
    await updateShop(values.id, values);

    window.location.reload();
    table.setEditingRow(null);
  };

  //DELETE action
  const openDeleteConfirmModal = async (row: MRT_Row<any>) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteShop(row.original.id);
      window.location.reload();
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: transformedResponse,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: true,
    getRowId: (row) => row.id,
    enableGlobalFilter: false,
    enableGlobalFilterModes: false,
    enableGlobalFilterRankedResults: false,
    enableFilterMatchHighlighting: false,
    manualFiltering: false,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateShop,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveShop,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Create New Shop</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    //optionally customize modal content
    renderEditRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle variant="h3">Edit Shop</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => {
      return (
        <>
          <Button
            variant="contained"
            onClick={() => {
              table.setCreatingRow(true);
            }}
            id="create-new-shop"
          >
            Create New Shop
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              logout(dispatch);
            }}
          >
            logout
          </Button>
        </>
      );
    },
    state: {},
  });

  return <MaterialReactTable table={table} />;
};

const ExampleWithProviders = () => <Example />;

export default ExampleWithProviders;

const validateRequired = (value: any) => {
  if (typeof value === "string" || typeof value === "number") {
    if (typeof value === "string") {
      return !!value.trim().length;
    }
    return true;
  }
  return false;
};

function validateShop(shop: any) {
  return {
    id: !validateRequired(shop.id) ? "ID is Required" : "",
    shopName: !validateRequired(shop.shopName) ? "shop name is Required" : "",
    name: !validateRequired(shop.name) ? "name of the cloth is Required" : "",
    price: !validateRequired(shop.price) ? "price is Required" : "",
    quantity: !validateRequired(shop.quantity) ? "quantity is Required" : "",
  };
}
