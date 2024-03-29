import classnames from 'classnames';
import { dropRight } from 'lodash';
import humanizeString from 'humanize-string';

import remoteSettings from '../../settings';
import Swiper from '../../components/Swiper';

import { SwiperBlockContext } from '.';
import { useState, useRef, useEffect } from 'react';


/**
 * WordPress dependencies
 */

const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { compose } = wp.compose;
const { withDispatch, withSelect } = wp.data;

const {
	withFilters,
	IconButton,
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	ToggleControl,
	TextControl,
	Toolbar,
	withNotices,
} = wp.components;


const { Fragment } = wp.element;

const {
	InspectorControls,
	InnerBlocks,
	BlockControls,
	BlockVerticalAlignmentToolbar,
} = wp.editor;


const { createBlock } = wp.blocks;

export const getSwiperControls = (props = {}, attributes = {}, size = 0, options = {}) => {

	const { exclude } = {
		exclude: [],
		...options
	};

	const { options: { theme }, themes } = remoteSettings;

	const themeOptions = [
		{
			label: `${__('Default')}${theme ? ` (${__(humanizeString(theme))})` : ''}`,
			value: ''
		},
		...Object.entries(themes).map(([ value, { name, label } ]) => ({
			label: label || name && __(humanizeString(name)) || __(humanizeString(value)), value
		}))
	];

	const maxSlidesPerView = Math.max(8, Math.floor(size / attributes.slidesPerColumn));
	const maxSlidesPerColumn = Math.max(4, Math.ceil((size * 2) / attributes.slidesPerView));


	return (
		<PanelBody title={ __( 'Swiper Settings' ) }>
			{size > 1 && (
				<Fragment>
					<RangeControl
						label={ __( 'Slides Per View' ) }
						value={ attributes.slidesPerView }
						onChange={(value) => props.setAttributes({
							...attributes,
							slidesPerView: value
						})}
						min={ 1 }
						max={ maxSlidesPerView }
						required
					/>
					<RangeControl
						label={ __( 'Slides Per Column' ) }
						value={ attributes.slidesPerColumn }
						onChange={(value) => props.setAttributes({
							...attributes,
							slidesPerColumn: value
						})}
						min={ 1 }
						max={ maxSlidesPerColumn }
						required
					/>
					{/*
					<TextControl
						label={ __( 'Space between' ) }
						value={ attributes.spaceBetween }
						onChange={(value) => props.setAttributes({
							...attributes,
							spaceBetween: value
						})}
					/>
					*/}
					<RangeControl
						label={ __( 'Space between' ) }
						value={ attributes.spaceBetween }
						onChange={(value) => props.setAttributes({
							...attributes,
							spaceBetween: value
						})}
						min={ 0 }
						max={ 100 }
					/>
					<ToggleControl
						label={ __( 'Centered Slides' ) }
						checked={ !! attributes.centeredSlides }
						onChange={ (value) => {
							props.setAttributes({
								...attributes,
								centeredSlides: value
							});
						} }
						help={ () => attributes.centeredSlides ? __('Slides are centered') : __(`Slides aren't centered`) }
					/>
				</Fragment>
			)}
			<ToggleControl
				label={ __( 'Navigation' ) }
				checked={ !! attributes.navigation }
				onChange={ (value) => {
					props.setAttributes({
						...attributes,
						navigation: value
					});
				} }
				help={ () => attributes.navigation ? __('Navigation is displayed') : __(`Navigation isn't displayed`) }
			/>
			<ToggleControl
				label={ __( 'Pagination' ) }
				checked={ !! attributes.pagination }
				onChange={ (value) => {
					props.setAttributes({
						...attributes,
						pagination: value ? {
							type: 'bullets',
							...(attributes.pagination || {})
						} : null
					});
				} }
				help={ () => attributes.pagination ? __('Pagination is displayed') : __(`Pagination isn't displayed`) }
			/>
			{attributes.pagination && (
				<Fragment>
					<SelectControl
		        label={__( 'Pagination Type' )}
		        value={ attributes.pagination.type }
		        options={ [
		          { label: 'Bullets', value: 'bullets' },
		          { label: 'Fraction', value: 'fraction' },
							{ label: 'Progressbar', value: 'progressbar' },
		        ] }
		        onChange={ ( value ) => props.setAttributes({
							...attributes,
							pagination: {
								...attributes.pagination,
								type: value
							}
						})}
		    	/>
					<ToggleControl
						label={ __( 'Pagination Clickable' ) }
						checked={ attributes.pagination.clickable }
						onChange={ ( value ) => props.setAttributes({
							...attributes,
							pagination: {
								...attributes.pagination,
								clickable: value
							}
						})}
						help={ () => attributes.pagination.clickable ? __('Pagination is clickable') : __(`Pagination isn't clickable`) }
					/>
				</Fragment>
			)}
			<ToggleControl
				label={ __( 'Scrollbar' ) }
				checked={ !! attributes.scrollbar }
				onChange={ (value) => {
					props.setAttributes({
						...attributes,
						scrollbar: value
					});
				} }
				help={ () => attributes.pagination ? __('Scrollbar is displayed') : __(`Scrollbar isn't displayed`) }
			/>
			<ToggleControl
				label={ __( 'Autoplay' ) }
				checked={ !! attributes.autoplay }
				onChange={ (value) => {
					props.setAttributes({
						...attributes,
						autoplay: value ? {
							delay: attributes.autoplay && attributes.autoplay.delay || 3000
						} : null
					});
				} }
				help={() => __(`Autoplay doesn't apply in edit mode`)}
			/>
			{attributes.autoplay && (
				<RangeControl
					label={ __( 'Autoplay delay' ) }
					value={ Math.floor((attributes.autoplay.delay || 3000) / 1000) }
					onChange={(value) => props.setAttributes({
						...attributes,
						autoplay: {
							...attributes.autoplay,
							delay: value * 1000
						}
					})}
					min={ 1 }
					max={ 10 }
				/>
			)}
			<ToggleControl
				label={ __( 'Loop' ) }
				checked={ attributes.loop }
				onChange={ (value) => {
					props.setAttributes({
						...attributes,
						loop: value
					});
				} }
				// help={ () => attributes.loop ? __('Continous Loop Mode is enabled') : __(`Continous Loop Mode is disabled`) }
				help={() => __(`Loop doesn't apply in edit mode`)}
			/>
			{typeof attributes.parallax !== 'undefined' && (
				<ToggleControl
					label={ __( 'Parallax' ) }
					checked={ attributes.parallax }
					onChange={ (value) => {
						props.setAttributes({
							...attributes,
							parallax: value
						});
					} }
					help={() => __(`Parallax doesn't apply in edit mode`)}
				/>
			)}
			{!exclude.includes('thumbs') && (
				<Fragment>
					<ToggleControl
						label={ __( 'Thumbs' ) }
						checked={ !! attributes.thumbs }
						onChange={ ( value ) => props.setAttributes({
							...attributes,
							thumbs: value ? {
								...(attributes.thumbs || {
									size: 'thumbnail'
								})
							} : null
						})}
						help={ () => !! attributes.thumbs ? __('Thumnails are displayed') : __(`Thumnails aren't displayed`) }
					/>
					{ !!attributes.thumbs && (
						<SelectControl
			        label={__( 'Thumbnail Size' )}
			        value={ attributes.thumbs && attributes.thumbs.size || 'thumbnail' }
			        options={ remoteSettings.sizes.map((size) => ({
			          label: __(humanizeString(size)),
			          value: size
			        }))}
			        onChange={ ( value ) => props.setAttributes({
			          ...attributes,
								thumbs: {
									...(attributes.thumbs || {}),
									size: value
								}
			        })}
			      />
					)}
				</Fragment>
			)}
			<SelectControl
				label={__( 'Theme' )}
				value={ attributes.theme }
				options={themeOptions}
				onChange={ ( value ) => props.setAttributes({
					...attributes,
					theme: value
				})}
			/>
		</PanelBody>
	);
}
