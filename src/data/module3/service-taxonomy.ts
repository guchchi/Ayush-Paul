export type ServiceFamily = 'editor' | 'designer' | 'developer' | 'automation' | 'other';

export type ProofProfileKey = 
  | 'short_form_editor'
  | 'video_editor'
  | 'ui_ux_designer'
  | 'brand_designer'
  | 'frontend_developer'
  | 'no_code_developer'
  | 'automation_developer'
  | 'podcast_clip_editor'
  | 'ad_creative_editor'
  | 'landing_page_designer'
  | 'social_media_designer'
  | 'presentation_designer'
  | 'other_fallback';

export interface ServiceClassification {
  id: string;
  label: string;
  family: ServiceFamily;
  proofProfileKey: ProofProfileKey;
}

const TAXONOMY: Record<string, ServiceClassification> = {
  // Editors
  video_editor: { id: 'video_editor', label: 'Video Editor', family: 'editor', proofProfileKey: 'video_editor' },
  short_form_editor: { id: 'short_form_editor', label: 'Short-Form Editor', family: 'editor', proofProfileKey: 'short_form_editor' },
  youtube_editor: { id: 'youtube_editor', label: 'YouTube Editor', family: 'editor', proofProfileKey: 'video_editor' },
  podcast_clip_editor: { id: 'podcast_clip_editor', label: 'Podcast Clip Editor', family: 'editor', proofProfileKey: 'podcast_clip_editor' },
  ad_creative_editor: { id: 'ad_creative_editor', label: 'Ad Creative Editor', family: 'editor', proofProfileKey: 'ad_creative_editor' },

  // Developers
  wordpress_developer: { id: 'wordpress_developer', label: 'WordPress Developer', family: 'developer', proofProfileKey: 'frontend_developer' },
  landing_page_developer: { id: 'landing_page_developer', label: 'Landing Page Developer', family: 'developer', proofProfileKey: 'frontend_developer' },
  custom_theme_development: { id: 'custom_theme_development', label: 'Custom Theme Developer', family: 'developer', proofProfileKey: 'frontend_developer' },
  frontend_developer: { id: 'frontend_developer', label: 'Frontend Developer', family: 'developer', proofProfileKey: 'frontend_developer' },
  no_code_developer: { id: 'no_code_developer', label: 'No-Code Developer', family: 'developer', proofProfileKey: 'no_code_developer' },

  // Designers
  ui_ux_designer: { id: 'ui_ux_designer', label: 'UI/UX Designer', family: 'designer', proofProfileKey: 'ui_ux_designer' },
  landing_page_designer: { id: 'landing_page_designer', label: 'Landing Page Designer', family: 'designer', proofProfileKey: 'landing_page_designer' },
  brand_designer: { id: 'brand_designer', label: 'Brand Designer', family: 'designer', proofProfileKey: 'brand_designer' },
  social_media_designer: { id: 'social_media_designer', label: 'Social Media Designer', family: 'designer', proofProfileKey: 'social_media_designer' },
  presentation_designer: { id: 'presentation_designer', label: 'Presentation Designer', family: 'designer', proofProfileKey: 'presentation_designer' },

  // Automation
  automation_developer: { id: 'automation_developer', label: 'Automation Developer', family: 'automation', proofProfileKey: 'automation_developer' },
};

export function classifyService(serviceId: string | null): ServiceClassification {
  if (!serviceId) {
    return {
      id: 'unknown',
      label: 'Professional',
      family: 'other',
      proofProfileKey: 'other_fallback',
    };
  }
  const clean = serviceId.trim().toLowerCase();
  if (TAXONOMY[clean]) {
    return TAXONOMY[clean];
  }

  // Derive classification for unknown/custom services dynamically
  let family: ServiceFamily = 'other';
  let proofProfileKey: ProofProfileKey = 'other_fallback';

  if (clean.includes('editor') || clean.includes('video') || clean.includes('clips') || clean.includes('production') || clean === 'long_form_content') {
    family = 'editor';
    proofProfileKey = clean.includes('short') ? 'short_form_editor' : 'video_editor';
  } else if (clean.includes('designer')) {
    family = 'designer';
    proofProfileKey = clean.includes('ui') || clean.includes('ux') ? 'ui_ux_designer' : 'brand_designer';
  } else if (clean.includes('developer')) {
    family = 'developer';
    proofProfileKey = 'frontend_developer';
  } else if (clean.includes('automation')) {
    family = 'automation';
    proofProfileKey = 'automation_developer';
  }

  // Clean format label from snake_case
  const label = serviceId.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: serviceId,
    label,
    family,
    proofProfileKey,
  };
}
