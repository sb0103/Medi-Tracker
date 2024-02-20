import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import "./basicTable.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: "12px",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: "10px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function BasicTable({
  headers,
  rows = [[]],
  sx = { minWidth: 650 },
}) {
  return (
    <TableContainer className="basicTable" component={Paper}>
      <Table sx={sx} aria-label="simple table">
        <TableHead>
          <StyledTableRow>
            {headers.map((head, i) => {
              if (i !== 0)
                return (
                  <StyledTableCell key={head} align="center">
                    {head}
                  </StyledTableCell>
                );
              else {
                return <StyledTableCell key={head}> {head}</StyledTableCell>;
              }
            })}
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, idx1) => (
            <StyledTableRow
              key={idx1}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((cell, i) => {
                if (i === 0) {
                  return (
                    <StyledTableCell
                      key={`TableCell${i}`}
                      className="odd-row"
                      component="th"
                      scope="row"
                    >
                      {cell}
                    </StyledTableCell>
                  );
                } else {
                  return (
                    <StyledTableCell
                      className={` ${i % 2 == 0}?"even-row" `}
                      key={`TableCell${i}`}
                      sx={{ fontWeight: 300 }}
                      align="center"
                    >
                      {cell}
                    </StyledTableCell>
                  );
                }
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
