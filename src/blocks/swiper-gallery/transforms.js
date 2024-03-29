/**
 * External dependencies
 */
import { filter, every, map } from 'lodash';

/**
 * WordPress dependencies
 */
const { createBlock } = wp.blocks;
const { mediaUpload } = wp.editor;
const { createBlobURL } = wp.blob;

/**
 * Internal dependencies
 */
import { pickRelevantMediaFiles } from './shared';

const parseShortcodeIds = ( ids ) => {
	if ( ! ids ) {
		return [];
	}

	return ids.split( ',' ).map( ( id ) => (
		parseInt( id, 10 )
	) );
};

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/image' ],
			transform: ( attributes ) => {
				// Init the align attribute from the first item which may be either the placeholder or an image.
				let { align } = attributes[ 0 ];
				// Loop through all the images and check if they have the same align.
				align = every( attributes, [ 'align', align ] ) ? align : undefined;

				const validImages = filter( attributes, ( { id, url } ) => id && url );

				return createBlock( 'swiper/swiper-gallery', {
					images: validImages.map( ( { id, url, alt, caption } ) => ( {
						id,
						url,
						alt,
						caption,
					} ) ),
					ids: validImages.map( ( { id } ) => id ),
					align,
				} );
			},
		},
		{
			type: 'shortcode',
			tag: 'swiper',
			attributes: {
				images: {
					type: 'array',
					shortcode: ( { named: { ids } } ) => {
						return parseShortcodeIds( ids ).map( ( id ) => ( {
							id,
						} ) );
					},
				},
				ids: {
					type: 'array',
					shortcode: ( { named: { ids } } ) => {
						return parseShortcodeIds( ids );
					},
				},
				columns: {
					type: 'number',
					shortcode: ( { named: { columns = '3' } } ) => {
						return parseInt( columns, 10 );
					},
				},
				linkTo: {
					type: 'string',
					shortcode: ( { named: { link = 'attachment' } } ) => {
						return link === 'file' ? 'media' : link;
					},
				},
			},
		},
		{
			// When created by drag and dropping multiple files on an insertion point
			type: 'files',
			isMatch( files ) {
				return files.length !== 1 && every( files, ( file ) => file.type.indexOf( 'image/' ) === 0 );
			},
			transform( files, onChange ) {
				const block = createBlock( 'swiper/swiper-gallery', {
					images: files.map( ( file ) => pickRelevantMediaFiles( {
						url: createBlobURL( file ),
					} ) ),
				} );
				mediaUpload( {
					filesList: files,
					onFileChange: ( images ) => {
						const imagesAttr = images.map(
							pickRelevantMediaFiles,
						);
						onChange( block.clientId, {
							ids: map( imagesAttr, 'id' ),
							images: imagesAttr,
						} );
					},
					allowedTypes: [ 'image' ],
				} );
				return block;
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/image' ],
			transform: ( { images, align } ) => {
				if ( images.length > 0 ) {
					return images.map( ( { id, url, alt, caption } ) => createBlock( 'core/image', {
						id,
						url,
						alt,
						caption,
						align,
					} ) );
				}
				return createBlock( 'core/image', { align } );
			},
		},
	],
};

export default transforms;
