/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import ReactDOM from 'react-dom';

import { getPassedTime } from 'functions/date';
import { ICommentBox, IComment } from './types';
import Styled from './styled';

class CommentBox extends React.Component<ICommentBox> {
  public static getRef(): HTMLElement | null {
    return CommentBox.portalElement.firstElementChild
      ? (CommentBox.portalElement.firstElementChild as HTMLElement)
      : null;
  }

  componentDidMount() {
    CommentBox.portalElement.id = 'comment-box';

    if (this.props.playground)
      this.props.playground.appendChild(CommentBox.portalElement);
  }

  // To avoid using 'UNSAFE_componentWillUpdate' instead
  shouldComponentUpdate() {
    if (document.querySelector('#comment-box')) return true;

    if (this.props.playground)
      this.props.playground.appendChild(CommentBox.portalElement);

    return true;
  }

  componentDidUpdate() {
    if (this.inputRef.current) this.inputRef.current.focus();
  }

  componentWillUnmount() {
    if (this.props.playground)
      this.props.playground.removeChild(CommentBox.portalElement);
  }

  public static portalElement = document.createElement('div');
  private inputRef = React.createRef<HTMLInputElement>();
  private ref = React.createRef<HTMLDivElement>();
  private blurTimeout = -1;

  render() {
    const {
      title,
      comments,
      playground,
      inputValue,
      isActive,
      isVisible,
      offsetTop,
      onClose,
      onInput,
      onSave
    } = this.props;

    return playground
      ? ReactDOM.createPortal(
          <Styled.CommentBox
            ref={this.ref}
            isVisible={isVisible}
            offsetTop={offsetTop}
            tabIndex={-1}
            onClick={(event: React.MouseEvent) => {
              if (!this.ref.current?.contains(event.currentTarget)) return;

              if (event.target !== this.inputRef.current && this.ref.current)
                this.ref.current.focus();
            }}
            onFocus={() => {
              window.clearTimeout(this.blurTimeout);
            }}
            onBlur={() => {
              this.blurTimeout = window.setTimeout(() => onClose(), 200);
            }}
            onScroll={(event: React.UIEvent) => {
              // Prevent comment box from closing
              event.stopPropagation();
            }}
          >
            <Styled.CommentBoxHead>
              <Styled.CommentBoxTitle>{title}</Styled.CommentBoxTitle>
              <Styled.CommentBoxClose onClick={onClose} />
            </Styled.CommentBoxHead>
            <Styled.CommentBoxBottom>
              <Styled.CommentBoxButton isActive={isActive} onClick={onSave}>
                Save changes
              </Styled.CommentBoxButton>
            </Styled.CommentBoxBottom>
            <Styled.CommentBoxBody>
              {comments?.map((comment: IComment, index: number) => (
                <Styled.Comment
                  key={`${btoa(comment.author_name + comment.timestamp)}-${
                    index + 1
                  }`}
                >
                  <Styled.CommentBody>{comment.body}</Styled.CommentBody>
                  <Styled.CommentMeta>
                    <Styled.CommentAuthor>{`${comment.author_name}`}</Styled.CommentAuthor>
                    <Styled.CommentPassedTime>{`${getPassedTime(
                      comment.timestamp
                    ).format()}`}</Styled.CommentPassedTime>
                  </Styled.CommentMeta>
                </Styled.Comment>
              ))}
              <Styled.CommentBoxInput
                ref={this.inputRef}
                placeholder="Type a comment…"
                isActive={isActive}
                onChange={onInput}
                value={inputValue}
              />
            </Styled.CommentBoxBody>
          </Styled.CommentBox>,
          CommentBox.portalElement
        )
      : null;
  }
}

export default CommentBox;
