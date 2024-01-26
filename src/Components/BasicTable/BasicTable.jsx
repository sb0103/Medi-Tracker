import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function BasicTable({
  headers,
  rows = [[]],
  sx = { minWidth: 650 },
}) {
  return (
    <TableContainer component={Paper}>
      <Table sx={sx} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((head, i) => {
              if (i !== 0)
                return (
                  <TableCell key={head} align="center">
                    {head}
                  </TableCell>
                );
              else {
                return <TableCell key={head}> {head}</TableCell>;
              }
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {console.log(rows)} */}
          {rows.map((row, idx1) => (
            <TableRow
              key={idx1}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((cell, i) => {
                if (i === 0) {
                  return (
                    <TableCell key={`TableCell${i}`} component="th" scope="row">
                      {cell}
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell
                      key={`TableCell${i}`}
                      sx={{ fontWeight: 300 }}
                      align="center"
                    >
                      {cell}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
