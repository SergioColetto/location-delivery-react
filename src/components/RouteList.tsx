import AddCircle from '@material-ui/icons/AddCircle';
import NavigationIcon from '@material-ui/icons/Navigation';

import {
  List,
  ListItem,
  Container,
  ListItemText,
  IconButton,
  Tooltip,
  Theme,
  makeStyles,
  createStyles,
  Button
} from '@material-ui/core';
import { Address } from '../interfaces/Address';
import { useEffect, useState } from 'react';

interface Props {
  route: Address[];
  handleRemove: Function
}

export const RouteList = ({ route, handleRemove }: Props) => {
  const classes = useStyles();
  const [routeList, setRouteList] = useState<Address[]>([])

  const getPosition = () => new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject)
  )

  const remove = (address: Address, index: number) => {
    if (routeList.includes(address)) {
      const ifDeleted = route.filter(a => a !== address)
      setRouteList(ifDeleted)
      handleRemove(address, index)
    }
  }
  
  const routeGenerator = async () => {
    if (routeList.length > 0) {
      const locationsBuild: string[] = [];
      // const { coords } = await getPosition();
      // locationsBuild.push(`${coords.latitude},${coords.longitude}`);
      locationsBuild.push("");
      routeList.forEach(address => locationsBuild.push(`${address.latitude},${address.longitude}`))
      locationsBuild.push(`@${locationsBuild[locationsBuild.length - 1]},14z/`)

      const allLocations = locationsBuild.join("/")

      const link = `https://www.google.com/maps/dir/${allLocations}`
      window.open(link, "_blank")
      return;
    }
  }

  useEffect(()=>{
    setRouteList( route )
  },[])

  return(
    <Container maxWidth="sm">
      <List className={classes.list}>

        {routeList.map((address, index) =>
          <ListItem id={index.toString()}>

            <Tooltip title="Map route from address">
              <IconButton >
                <NavigationIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <ListItemText className={classes.listContent}
              primary={`${address.line_1} | ${address.line_2}`}
              secondary={`${address.postcode} | ${address.district} UK`} />

            <Tooltip title="Add address in route">
              <IconButton edge="end"
                onClick={() => remove(address, index)}>
                <AddCircle className={classes.green} />
              </IconButton>
            </Tooltip>

          </ListItem>,
        )}
      </List>
      { routeList.length > 0 ? <Button onClick={routeGenerator} >Generate Router in Google Maps</Button>: null }
    </Container>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    list: {
      padding: theme.spacing(2),
      textAlign: 'center',
      marginTop: theme.spacing(6),
    },
    listContent: {
      marginLeft: theme.spacing(5),
    },
    green: {
      color: '#33CC33'
    }

  }),
);