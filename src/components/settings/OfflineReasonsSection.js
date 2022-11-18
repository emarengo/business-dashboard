import React from 'react';
import { Switch, TextInput } from '@thebeatapp/beat-ui';

import Styled from './styled';
import Actions from './actions';
import { displayError, mapOfflineReasons } from '../../functions';
import { apiService } from '../../data';
import { handleApiResponse } from '../../data/api';

const INPUT_MAX_LENGTH = 30;

export default ({ state, dispatch }) => {
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const [dragSourceIndex, setDragSourceIndex] = React.useState(-1);
  const [dropZoneIndex, setDropZoneIndex] = React.useState(-1);
  const [isDraggable, setIsDraggable] = React.useState(true);
  const sourceTarget = React.useRef(null);
  const gridRef = React.useRef({});
  const [gridHeight, setGridHeight] = React.useState(0);

  React.useEffect(() => {
    if (state.cityId)
      (async function () {
        handleApiResponse(
          await apiService.getOfflineReasons(state.cityId),
          (response) => {
            dispatch({
              type: Actions.UPDATE_GO_OFFLINE_REASONS,
              payload: {
                reasons: mapOfflineReasons(response)
              }
            });
          },
          (error) => {
            displayError(`${error.name}: ${error.message}`);
          }
        );
      })();
    // eslint-disable-next-line
  }, [state.cityId]);

  const hasErrors = () =>
    Object.values(state.errors.reasons).some((err) => {
      if (err !== null) {
        if ('_ignore' in err) {
          return !err._ignore && Object.keys(err).length > 1;
        }
        return true;
      }
      return false;
    });

  const getError = (id) => state.errors.reasons[id] || '';

  // Enable/disable 'Go Offline Reasons' for driver
  const handleSwitchChange = () => {
    dispatch({
      type: Actions.TOGGLE_CONFIRMATION_DIALOG,
      payload: {
        section: '_OFFLINE_REASONS_SWITCH_'
      }
    });
  };

  const validate = (name, value) => {
    if (!value) {
      return 'This field is required';
    } else if (value.length > INPUT_MAX_LENGTH) {
      return 'You have exceeded character limit';
    } else if (
      name === 'code' &&
      state.reasons.filter((r) => r.code === value).length > 0
    ) {
      return 'This unique id is already taken';
    }
    return null;
  };

  const handleInputChange = (index, name) => (event) => {
    const { value } = event.target;
    let error = null;

    // [SPEC] Validate only active offline reasons
    if (state.reasons[index].active) {
      error = validate(name, value);
    }

    dispatch({
      type: Actions.HANDLE_GO_OFFLINE_REASON_INPUT,
      payload: {
        value,
        index,
        name,
        error
      }
    });
  };

  const handleDragStart = (index) => (event) => {
    sourceTarget.current = event.currentTarget;
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.effectAllowed = 'move';

    // Create a ghost element that appears as the one's been dragged
    const [, fields] = event.currentTarget.childNodes;
    const ghostElement = event.currentTarget.cloneNode(true);
    ghostElement.classList.add('ghost');
    ghostElement.style.width = `${fields.clientWidth}px`;
    document.body.appendChild(ghostElement);

    // Create drag image from the ghost element
    const bounds = event.currentTarget.getBoundingClientRect();
    const xOffset = event.clientX - bounds.left - 20;
    const yOffset = event.clientY - bounds.top + 10;
    event.dataTransfer.setDragImage(ghostElement, xOffset, yOffset);

    // Lock height to avoid flickering
    setGridHeight(gridRef.current.offsetHeight);

    // Update drag source index
    setDragSourceIndex(index);

    setTimeout(() => {
      sourceTarget.current.classList.add('is-dragged');
    }, 0);
  };

  const handleDragOver = (index) => (event) => {
    event.preventDefault();
    // eslint-disable-next-line no-param-reassign
    event.dataTransfer.dropEffect = 'move';

    if (dropZoneIndex !== index && dragSourceIndex !== index) {
      sourceTarget.current.classList.add('is-hidden');
      setDropZoneIndex(index);
    } else {
      sourceTarget.current.classList.remove('is-hidden');
      setDropZoneIndex(dragSourceIndex);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();

    dispatch({
      type: Actions.UPDATE_GO_OFFLINE_REASON_ORDER,
      payload: {
        sourceIndex: dragSourceIndex,
        targetIndex: dropZoneIndex
      }
    });
  };

  const handleDragEnd = (event) => {
    event.preventDefault();
    event.currentTarget.classList.remove('is-dragged');
    event.currentTarget.classList.remove('is-hidden');

    // Get rid off it otherwise it'll appear at the page bottom
    document.querySelector('.ghost').remove();

    setDropZoneIndex(-1);
  };

  const handleSaveChanges = () => {
    // Remove empties
    dispatch({
      type: Actions.UPDATE_GO_OFFLINE_REASONS,
      payload: { reasons: state.reasons.filter((r) => !r.isEmpty()) }
    });

    if (!hasErrors()) {
      dispatch({
        type: Actions.TOGGLE_CONFIRMATION_DIALOG,
        payload: {
          section: '_OFFLINE_REASONS_FORM_'
        }
      });
    } else {
      setIsErrorVisible(true);
    }
  };

  const saveButton = state.isOfflineReasonsSaveButtonVisible ? (
    <Styled.Button onClick={handleSaveChanges}>Save changes</Styled.Button>
  ) : null;

  return (
    <Styled.Fieldset data-testid="go-offline-reasons">
      <Styled.Legend>
        <Switch
          isActive={state.isGoOfflineReasonsEnabled}
          onClick={handleSwitchChange}
          testId="go-offline-reasons-switch"
        />
        <Styled.Title>Going Offline Reasons</Styled.Title>
        {saveButton}
      </Styled.Legend>
      <Styled.Description>
        Loonshot drivers need to declare the reason, every time they go offline
        during their shift. Provide below the options to Loonshot drivers. You
        can also hide reasons from the driver app, and keep them as drafts for
        future use.
      </Styled.Description>
      <Styled.Grid>
        <Styled.GridDraggableRow>
          <Styled.GridFields>
            <Styled.GridHeadColumn>
              Icon
              <Styled.ExternalLink
                href="https://s3-eu-west-1.amazonaws.com/beat-general/fonts/index.html"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Styled.InfoIcon />
              </Styled.ExternalLink>
            </Styled.GridHeadColumn>
            <Styled.GridHeadColumn>Reason (EN)</Styled.GridHeadColumn>
            <Styled.GridHeadColumn>Reason (Translated)</Styled.GridHeadColumn>
            <Styled.GridHeadColumn>Driver's status(EN)</Styled.GridHeadColumn>
            <Styled.GridHeadColumn>
              Driver's status (Translated)
            </Styled.GridHeadColumn>
            <Styled.GridHeadColumn>Unique code</Styled.GridHeadColumn>
          </Styled.GridFields>
        </Styled.GridDraggableRow>
        <Styled.GridBody ref={gridRef} height={gridHeight}>
          {state.reasons.map((reason, index) => {
            const error = getError(reason.prop('_id'));

            return (
              <React.Fragment key={reason.prop('_id')}>
                <Styled.GridShadowRow
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  isVisible={dragSourceIndex > index && index === dropZoneIndex}
                >
                  <Styled.GridFields>
                    {Array.from({ length: 6 }).map((_, ii) => (
                      <Styled.ShadowField key={`sf_top_${ii}`} />
                    ))}
                  </Styled.GridFields>
                </Styled.GridShadowRow>
                <Styled.GridDraggableRow
                  data-testid="grid-draggable-row"
                  draggable={isDraggable}
                  onDragStart={handleDragStart(index)}
                  onDragOver={handleDragOver(index)}
                  onDragEnd={handleDragEnd}
                >
                  <Styled.RowActions>
                    <Styled.RowVisibility
                      data-testid="offline-reason-visibility"
                      isActive={reason.prop('active')}
                      onClick={() =>
                        dispatch({
                          type: Actions.TOGGLE_GO_OFFLINE_REASON_VISIBILITY,
                          payload: {
                            index,
                            field: 'active'
                          }
                        })
                      }
                    />
                    <Styled.RowDrag onDragStart={handleDragStart(index)} />
                  </Styled.RowActions>
                  <Styled.GridFields
                    data-testid="offline-reason-fields"
                    showAsInactive={!reason.prop('active')}
                  >
                    <Styled.IconInput>
                      <TextInput
                        value={reason.prop('icon')}
                        maxLength={1}
                        placeholder="Type"
                        hasError={isErrorVisible && Boolean(error.icon)}
                        error={error.icon}
                        onChange={handleInputChange(index, 'icon')}
                        onFocus={() => setIsDraggable(true)}
                      />
                    </Styled.IconInput>
                    {[
                      'name',
                      'name_en',
                      'description',
                      'description_en',
                      'code'
                    ].map((name) => (
                      <TextInput
                        key={`input-${index + 1}-${name}`}
                        placeholder={`Max ${INPUT_MAX_LENGTH} characters`}
                        value={reason.prop(name)}
                        disabled={name === 'code' && reason.prop('saved')}
                        hasError={isErrorVisible && Boolean(error[name])}
                        error={error[name]}
                        onChange={handleInputChange(index, name)}
                        onFocus={() => setIsDraggable(false)}
                        onBlur={() => setIsDraggable(true)}
                      />
                    ))}
                  </Styled.GridFields>
                </Styled.GridDraggableRow>
                <Styled.GridShadowRow
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  isVisible={dragSourceIndex < index && index === dropZoneIndex}
                >
                  <Styled.GridFields>
                    {Array.from({ length: 6 }).map((_, ii) => (
                      <Styled.ShadowField key={`sf_bottom_${ii}`} />
                    ))}
                  </Styled.GridFields>
                </Styled.GridShadowRow>
              </React.Fragment>
            );
          })}
        </Styled.GridBody>
      </Styled.Grid>
      <Styled.Add
        onClick={() => dispatch({ type: Actions.ADD_GO_OFFLINE_REASON })}
      >
        + Add reason
      </Styled.Add>
    </Styled.Fieldset>
  );
};
