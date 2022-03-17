import React, {useEffect, useState, useCallback} from "react";
import Typography from "@mui/material/Typography/Typography";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component/dist-es6";
import Popover from "@mui/material/Popover/Popover";
import {sortValues} from "../../helpers/getValueByDate";

function PopWindow(props) {

    const [sortedParents, setSortedParents] = useState(null);
    const {isOpen, anchorElement, handleClose, loadedEntity} = props;

    const loadSortedParents = useCallback(() => {
        let parents = null;
        if (loadedEntity?.attributes?.parent) {
            parents = sortValues(loadedEntity?.attributes?.parent?.values);
        }
        setSortedParents(parents);
    }, [loadedEntity]);

    useEffect(() => {
        if (loadedEntity) {
            loadSortedParents();
        }
    }, [loadedEntity, loadSortedParents]);

    return <Popover
        style={{maxHeight: '80%'}}
        sx={{
            ".MuiPopover-paper": {
                backgroundColor: 'rgb(9,9,9)'
            }
        }}
        id={'popover'}
        open={isOpen}
        anchorEl={anchorElement}
        onClose={handleClose}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
    >
        <Typography variant="h5">{loadedEntity?.title}<br/><br/></Typography>
        <Typography>Parent:</Typography>
        {sortedParents &&
        <VerticalTimeline>
            {sortedParents?.map((parent) => (
                <VerticalTimelineElement
                    key={parent.date}
                    className="vertical-timeline-element--work"
                    contentStyle={{background: '#0784b5', color: '#fff', fontSize: '10px'}}
                    contentArrowStyle={{borderRight: '7px solid  #2593b8'}}
                    date={parent?.date?.split('T')[0]}
                >
                    <p>{parent.value_string}</p>
                </VerticalTimelineElement>
            ))}
        </VerticalTimeline>}
        <Typography><br/>Last Updated: {loadedEntity?.updated_at}</Typography>
    </Popover>
}

export default PopWindow